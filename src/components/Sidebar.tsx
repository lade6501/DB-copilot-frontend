import type { QuerySession, WorkflowStatus } from "../types";

interface SidebarProps {
  sessions: QuerySession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
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
    label: "Waiting Approval",
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

function getRisk(session: QuerySession) {
  const riskStep = session.steps.find((s) => s.step === "risk_analysis");

  if (!riskStep) return "Unknown";

  if ("risk" in riskStep && typeof riskStep.risk === "string") {
    return riskStep.risk;
  }

  const data = riskStep.data as Record<string, unknown> | undefined;

  return (data?.risk_level as string) ?? (data?.risk as string) ?? "Unknown";
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onClear,
}: SidebarProps) {
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();

    if (diff < 60000) return "Just now";

    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">DB Copilot</div>

        {sessions.length > 0 && (
          <button className="sidebar__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <div className="sidebar__section">
        {sessions.length === 0 ? (
          <div className="sidebar__empty">No requests yet</div>
        ) : (
          sessions.map((session) => {
            const status = STATUS_META[session.workflowStatus];

            return (
              <div
                key={session.id}
                className={`sidebar__session ${
                  activeSessionId === session.id
                    ? "sidebar__session--active"
                    : ""
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="sidebar__session-top">
                  <span
                    className="sidebar__status-dot"
                    style={{
                      background: status.color,
                    }}
                  />

                  <span className="sidebar__query">{session.query}</span>
                </div>

                <div className="sidebar__badges">
                  <span
                    className="sidebar__badge"
                    style={{
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>

                  <span className="sidebar__badge sidebar__badge--risk">
                    {getRisk(session)}
                  </span>
                </div>

                <div className="sidebar__time">
                  {formatTime(session.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
