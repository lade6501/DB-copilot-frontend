import { useState, useCallback } from "react";
import type { QueryHistory } from "../types";

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistory[]>([]);

  const addHistory = useCallback(
    (query: string, success: boolean, rowCount?: number) => {
      const entry: QueryHistory = {
        id: crypto.randomUUID(),
        query,
        timestamp: new Date(),
        rowCount,
        success,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 20));
    },
    [],
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addHistory, clearHistory };
}
