import { useState, useRef, useCallback, useEffect } from "react";

import type { Step, QuerySession, WorkflowStatus } from "../types";
import { getValidAccessToken } from "../utils/authUtils";

const WS_URL = "ws://localhost:8000/ws/query";

type WS = WebSocket;

function getWorkflowStatus(step: Step): WorkflowStatus {
  switch (step.step) {
    case "approval_required":
    case "approval_requested":
      return "awaiting_approval";

    case "approval_approved":
      return "approved";

    case "approval_rejected":
      return "rejected";

    case "execution_started":
      return "executing";

    case "execution_completed":
    case "result_ready":
    case "summary":
    case "done":
      return "completed";

    case "error":
      return "failed";

    default:
      return "running";
  }
}

export function useWebSocket() {
  const [sessions, setSessions] = useState<QuerySession[]>(() => {
    try {
      const saved = localStorage.getItem("db_copilot_sessions");
      if (saved) {
        const parsed = JSON.parse(saved) as QuerySession[];
        return parsed.map((s) => ({
          ...s,
          timestamp: new Date(s.timestamp),
        }));
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage:", e);
    }
    return [];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem("db_copilot_sessions");
      if (saved) {
        const parsed = JSON.parse(saved) as QuerySession[];
        if (parsed.length > 0) {
          return parsed[0].id;
        }
      }
    } catch (e) {
      console.error("Failed to load activeSessionId from localStorage:", e);
    }
    return null;
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("db_copilot_sessions", JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions to localStorage:", e);
    }
  }, [sessions]);

  const wsRef = useRef<WS | null>(null);

  const getActiveSession = useCallback(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  const sendQuery = useCallback(async (query: string) => {
    const sessionId = `session-${Date.now()}`;

    const newSession: QuerySession = {
      id: sessionId,
      query,
      timestamp: new Date(),
      steps: [],
      status: "running",
      workflowStatus: "running",
      success: false,
      result: undefined,
      approval: undefined,
      approvalId: undefined,
      polling: false,
      execution: undefined,
      audit: undefined,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(sessionId);

    if (wsRef.current) {
      wsRef.current.close();
    }

    setIsConnecting(true);

    try {
      const token = await getValidAccessToken();
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnecting(false);
        ws.send(
          JSON.stringify({
            query,
          }),
        );
      };

      ws.onerror = () => {
        setIsConnecting(false);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  status: "error",
                  workflowStatus: "failed",
                }
              : s,
          ),
        );
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const step: Step = JSON.parse(event.data);
          const workflowStatus = getWorkflowStatus(step);
          const approvalId =
            step.step === "approval_required"
              ? (step.approval_id as string | undefined)
              : undefined;

          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== sessionId) {
                return s;
              }

              const updatedSteps = [...s.steps];
              const existingIndex = updatedSteps.findIndex(
                (st) => st.step === step.step,
              );

              if (existingIndex >= 0) {
                updatedSteps[existingIndex] = {
                  ...updatedSteps[existingIndex],
                  ...step,
                  status: step.status ?? "completed",
                };
              } else {
                updatedSteps.push({
                  ...step,
                  status: step.status ?? "completed",
                });
              }

              return {
                ...s,
                approvalId: approvalId ?? s.approvalId,
                polling: step.step === "approval_required" ? true : s.polling,
                steps: updatedSteps,
                workflowStatus,
                status:
                  workflowStatus === "completed"
                    ? "completed"
                    : workflowStatus === "failed"
                      ? "error"
                      : "running",
                success:
                  workflowStatus === "completed"
                    ? true
                    : workflowStatus === "failed"
                      ? false
                      : s.success,
                result: step.result ?? s.result,
                approval: step.approval ?? s.approval,
                execution: step.execution ?? s.execution,
                audit: step.audit ?? s.audit,
              };
            }),
          );

          if (step.step === "done" || step.step === "error") {
            ws.close();
          }
        } catch (err) {
          console.error("WebSocket parse error:", err);
        }
      };

      ws.onclose = () => {
        setIsConnecting(false);
      };
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                status: "error",
                workflowStatus: "failed",
              }
            : s,
        ),
      );
    }
  }, []);

  return {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    activeSession: getActiveSession(),
    isConnecting,
    sendQuery,
  };
}
