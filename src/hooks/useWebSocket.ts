import { useState, useRef, useCallback } from "react";
import type { Step, QuerySession } from "../types/index";

const WS_URL = "ws://localhost:8000/ws/query";

type WS = WebSocket;

export function useWebSocket() {
  const [sessions, setSessions] = useState<QuerySession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WS | null>(null);

  const getActiveSession = useCallback(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  const sendQuery = useCallback((query: string) => {
    const sessionId = `session-${Date.now()}`;
    const newSession: QuerySession = {
      id: sessionId,
      query,
      timestamp: new Date(),
      steps: [],
      status: "running",
      success: false,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(sessionId);

    if (wsRef.current) wsRef.current.close();

    setIsConnecting(true);
    const ws: WS = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      ws.send(JSON.stringify({ query }));
    };

    ws.onerror = () => {
      setIsConnecting(false);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: "error" } : s)),
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const step: Step = JSON.parse(event.data as string);

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s;
            const updatedSteps = [...s.steps];
            const idx = updatedSteps.findIndex((st) => st.step === step.step);
            if (idx >= 0) {
              updatedSteps[idx] = {
                ...updatedSteps[idx],
                ...step,
                status: "completed",
              };
            } else {
              updatedSteps.push({
                ...step,
                status: step.step === "done" ? "completed" : "completed",
              });
            }
            const result = step.step === "execute" ? step.result : s.result;
            return {
              ...s,
              steps: updatedSteps,
              result,
              status:
                step.step === "done"
                  ? "completed"
                  : step.step === "error"
                    ? "error"
                    : "running",
            };
          }),
        );

        if (step.step === "done" || step.step === "error") ws.close();
      } catch {}
    };

    ws.onclose = () => {
      setIsConnecting(false);
    };
  }, []);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId: (id: string) => setActiveSessionId(id),
    activeSession: getActiveSession(),
    isConnecting,
    sendQuery,
  };
}
