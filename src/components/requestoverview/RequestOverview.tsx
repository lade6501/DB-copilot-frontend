import type { QuerySession, WorkflowStatus } from "../../types";
import "./style.css";

interface Props {
  session: QuerySession | null;
}

const STATUS_META: Record<
  WorkflowStatus,
  {
    label: string;
    color: string;
  }
> = {
  running: {
    label: "Running",
    color: "#3b82f6",
  },
  awaiting_approval: {
    label: "Waiting for Approval",
    color: "#f59e0b",
  },
  approved: {
    label: "Approved",
    color: "#10b981",
  },
  executing: {
    label: "Executing",
    color: "#6366f1",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
  },
  failed: {
    label: "Failed",
    color: "#ef4444",
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
  },
};

function getRisk(session: QuerySession): string {
  const riskStep = session.steps.find((s) => s.step === "risk_analysis");

  if (!riskStep) return "Unknown";

  const data = riskStep.data as Record<string, unknown> | undefined;

  return (data?.risk_level as string) ?? (data?.risk as string) ?? "Unknown";
}

function getCurrentStage(session: QuerySession): string {
  if (session.steps.length === 0) return "Starting";

  return session.steps[session.steps.length - 1].step
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RequestOverview({ session }: Props) {
  if (!session) return null;

  const status = STATUS_META[session.workflowStatus];

  return (
    <section className="request-overview">
      <div className="request-overview__header">
        <div>
          <div className="request-overview__label">Current Request</div>

          <h2 className="request-overview__query">{session.query}</h2>
        </div>

        <div
          className="request-overview__status"
          style={{
            background: `${status.color}20`,
            color: status.color,
          }}
        >
          <span
            className="request-overview__status-dot"
            style={{
              background: status.color,
            }}
          />

          {status.label}
        </div>
      </div>

      <div className="request-overview__grid">
        <div className="request-overview__item">
          <span className="request-overview__item-label">Current Stage</span>

          <span className="request-overview__item-value">
            {getCurrentStage(session)}
          </span>
        </div>

        <div className="request-overview__item">
          <span className="request-overview__item-label">Risk</span>

          <span className="request-overview__item-value">
            {getRisk(session)}
          </span>
        </div>

        <div className="request-overview__item">
          <span className="request-overview__item-label">Started</span>

          <span className="request-overview__item-value">
            {session.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="request-overview__item">
          <span className="request-overview__item-label">Steps Completed</span>

          <span className="request-overview__item-value">
            {session.steps.length}
          </span>
        </div>
      </div>
    </section>
  );
}
