import type { QuerySession } from "../../types";

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

function getRisk(session: QuerySession) {
  const step = session.steps.find((s) => s.step === "risk_analysis");

  if (!step) return "Unknown";

  if ("risk" in step && typeof step.risk === "string") {
    return step.risk;
  }

  const data = step.data as Record<string, unknown> | undefined;

  return (data?.risk_level as string) ?? (data?.risk as string) ?? "Unknown";
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
          <strong>{getCurrentStage(session)}</strong>
        </div>

        <div>
          <span>Risk</span>
          <strong>{getRisk(session)}</strong>
        </div>

        <div>
          <span>Started</span>
          <strong>{session.timestamp.toLocaleTimeString()}</strong>
        </div>

        <div>
          <span>Steps</span>
          <strong>{session.steps.length}</strong>
        </div>
      </div>
    </div>
  );
}
