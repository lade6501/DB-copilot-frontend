import EmptyState from "./EmptyState";
import CrudActionCard from "./CrudActionCard";
import ReadResultTable from "./ReadResultTable";
import RequestStatusCard from "./RequestStatusCard";

import type { QuerySession } from "../../types";
import "./style.css";

interface Props {
  session: QuerySession | null;
}

export default function ResultPanel({ session }: Props) {
  if (!session) {
    return (
      <aside className="result-panel">
        <EmptyState />
      </aside>
    );
  }

  if (
    session.workflowStatus !== "completed" &&
    session.workflowStatus !== "failed"
  ) {
    return (
      <aside className="result-panel">
        <RequestStatusCard session={session} />
      </aside>
    );
  }

  if (!session.result) {
    return (
      <aside className="result-panel">
        <EmptyState />
      </aside>
    );
  }

  return (
    <aside className="result-panel">
      {session.result.action === "read" && (
        <ReadResultTable result={session.result} />
      )}

      {["write", "update", "delete"].includes(session.result.action) && (
        <CrudActionCard result={session.result} />
      )}
    </aside>
  );
}
