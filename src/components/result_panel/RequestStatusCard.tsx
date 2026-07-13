import type { QuerySession } from "../../types";
import { RiskBadge } from "../RiskBadge";

interface Props {
  session: QuerySession;
}

const STATUS_LABELS = {
  running: "Running",
  awaiting_approval: "Waiting for Approval",
  approved: "Approved",
  executing: "Executing",
  completed: "Completed",
  failed: "Failed",
  rejected: "Rejected",
};

const STATUS_COLORS = {
  running: "#3b82f6",
  awaiting_approval: "#f59e0b",
  approved: "#10b981",
  executing: "#6366f1",
  completed: "#22c55e",
  failed: "#ef4444",
  rejected: "#ef4444",
};

function getCurrentStage(session: QuerySession) {
  if (!session.steps.length) return "Starting";

  return session.steps[session.steps.length - 1].step
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RequestStatusCard({ session }: Props) {
  const color = STATUS_COLORS[session.workflowStatus];

  return (
    <div className="request-status-card">
      <div className="request-status-card__header">Current Request</div>

      <div className="request-status-card__query">{session.query}</div>

      <div className="request-status-card__status" style={{ color }}>
        ● {STATUS_LABELS[session.workflowStatus]}
      </div>

      <div className="request-status-card__grid">
        <div>
          <span>Stage</span>
          <strong className="block mt-0.5">{getCurrentStage(session)}</strong>
        </div>

        <div>
          <span>Risk</span>
          <div className="mt-1">
            <RiskBadge session={session} />
          </div>
        </div>

        <div>
          <span>Started</span>
          <strong className="block mt-0.5">{session.timestamp.toLocaleTimeString()}</strong>
        </div>

        <div>
          <span>Steps</span>
          <strong className="block mt-0.5">{session.steps.length}</strong>
        </div>
      </div>
    </div>
  );
}
