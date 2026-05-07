import { useState, useCallback } from "react";
import type { QuerySession } from "../types";

export function useQueryHistory() {
  const [history, setHistory] = useState<QuerySession[]>([]);

  const addHistory = useCallback(
    (query: string, success: boolean, rowCount?: number) => {
      const entry: QuerySession = {
        id: crypto.randomUUID(),
        query,
        timestamp: new Date(),
        rowCount,
        success,
        status: "completed",
        steps: [],
      };
      setHistory((prev) => [entry, ...prev].slice(0, 20));
    },
    [],
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addHistory, clearHistory };
}
