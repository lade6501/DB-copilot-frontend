import EmptyState from "./EmptyState";
import CrudActionCard from "./CrudActionCard";
import ReadResultTable from "./ReadResultTable";

import type { QuerySession } from "../types";

interface Props {
  session: QuerySession | null;
}

export default function ResultPanel({ session }: Props) {
  const result = session?.result;

  return (
    <aside className="result-panel">
      {!result && <EmptyState />}

      {result?.action === "read" && <ReadResultTable result={result} />}

      {(result?.action === "write" ||
        result?.action === "update" ||
        result?.action === "delete") && <CrudActionCard result={result} />}
    </aside>
  );
}
