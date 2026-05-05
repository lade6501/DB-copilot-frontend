import { useState, useRef, useCallback } from "react";
import type { Step } from "../types";

const WS_URL = "ws://localhost:8000/ws/query";

interface UseWebSocketReturn {
  steps: Step[];
  loading: boolean;
  connected: boolean;
  error: string | null;
  sendQuery: (query: string) => void;
  reset: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const reset = useCallback(() => {
    setSteps([]);
    setError(null);
    setLoading(false);
  }, []);

  const sendQuery = useCallback(
    (query: string) => {
      reset();
      setLoading(true);

      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ query }));
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: Step = JSON.parse(event.data as string);

          if (data.step === "done") {
            setLoading(false);
            ws.close();
            return;
          }

          setSteps((prev) => {
            const existingIndex = prev.findIndex((s) => s.step === data.step);

            const newStatus =
              data.status ??
              (data.step === "start" ? "completed" : "in_progress");

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...data,
                status: newStatus,
              };
              return updated;
            }

            return [...prev, { ...data, status: newStatus }];
          });
        } catch {
          setError("Failed to parse server response");
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection failed. Is the server running?");
        setLoading(false);
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        setLoading(false);
      };
    },
    [reset],
  );

  return { steps, loading, connected, error, sendQuery, reset };
}
