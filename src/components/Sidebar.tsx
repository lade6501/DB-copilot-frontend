import type { QuerySession, WorkflowStatus } from "../types";
import { RiskBadge } from "./RiskBadge";

interface SidebarProps {
  sessions: QuerySession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const STATUS_COLORS: Record<WorkflowStatus, string> = {
  running: "#3b82f6",
  awaiting_approval: "#f59e0b",
  approved: "#10b981",
  executing: "#6366f1",
  completed: "#22c55e",
  failed: "#ef4444",
  rejected: "#ef4444",
};

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  running: "Running",
  awaiting_approval: "Waiting Approval",
  approved: "Approved",
  executing: "Executing",
  completed: "Completed",
  failed: "Failed",
  rejected: "Rejected",
};

export function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onClear,
  isCollapsed,
  onToggleCollapse,
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
    <aside 
      className={`h-full flex flex-col bg-slate-50/50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isCollapsed ? "w-[44px] min-w-[44px]" : "w-[220px] min-w-[220px]"
      }`}
      style={{ width: isCollapsed ? "44px" : "220px" }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 min-h-[53px] flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase select-none">
              History
            </span>
            {sessions.length > 0 && (
              <button 
                className="text-[10px] bg-gray-105 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                onClick={onClear}
              >
                Clear
              </button>
            )}
          </div>
        )}
        
        <button
          className={`p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer ${
            isCollapsed ? "mx-auto" : "ml-auto"
          }`}
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand History" : "Collapse History"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1.5 min-w-0">
        {sessions.length === 0 ? (
          <div className="text-center text-xs text-gray-400 dark:text-gray-550 py-8 select-none">
            {!isCollapsed ? "No requests yet" : "—"}
          </div>
        ) : (
          sessions.map((session) => {
            const statusColor = STATUS_COLORS[session.workflowStatus] || "#94a3b8";
            const isActive = activeSessionId === session.id;

            if (isCollapsed) {
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-center h-9 w-9 rounded-lg cursor-pointer border transition-all duration-200 mx-auto ${
                    isActive
                      ? "bg-indigo-55 dark:bg-indigo-950/20 border-indigo-505 dark:border-indigo-400"
                      : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  }`}
                  onClick={() => onSelect(session.id)}
                  title={session.query}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      session.status === "running" ? "animate-pulse" : ""
                    }`}
                    style={{ backgroundColor: statusColor }}
                  />
                  
                  <div className="absolute left-11 hidden group-hover:block z-50 bg-gray-900 text-white text-xs rounded px-2.5 py-1.5 whitespace-nowrap shadow-md max-w-[200px] truncate border border-gray-800">
                    <p className="font-semibold truncate max-w-[160px]">{session.query}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{STATUS_LABELS[session.workflowStatus]}</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={session.id}
                className={`flex flex-col p-2.5 rounded-lg cursor-pointer border text-left transition-all duration-200 w-full min-w-0 overflow-hidden ${
                  isActive
                    ? "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-500 dark:border-indigo-400/50 shadow-sm"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/40"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-start gap-2 mb-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      session.status === "running" ? "animate-pulse" : ""
                    }`}
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate leading-tight flex-1">
                    {session.query}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-1 gap-1 border-t border-gray-100/50 dark:border-gray-800/50 flex-shrink-0">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase select-none">
                    {formatTime(session.timestamp)}
                  </span>
                  
                  <div className="flex items-center flex-shrink-0">
                    <RiskBadge session={session} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
