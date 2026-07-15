import type { QuerySession, WorkflowStatus } from "../../types";
import { RiskBadge } from "../RiskBadge";

interface Props {
  session: QuerySession | null;
}

const STATUS_META: Record<
  WorkflowStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    dotColor: string;
  }
> = {
  running: {
    label: "Running",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-900/30",
    dotColor: "bg-blue-500 animate-pulse",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    textColor: "text-amber-700 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-900/30",
    dotColor: "bg-amber-500 animate-pulse",
  },
  approved: {
    label: "Approved",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    textColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-900/30",
    dotColor: "bg-emerald-500",
  },
  executing: {
    label: "Executing",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    textColor: "text-indigo-700 dark:text-indigo-400",
    borderColor: "border-indigo-200 dark:border-indigo-900/30",
    dotColor: "bg-indigo-500 animate-pulse",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    textColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-900/30",
    dotColor: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    textColor: "text-rose-700 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-900/30",
    dotColor: "bg-rose-500",
  },
  rejected: {
    label: "Rejected",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    textColor: "text-rose-700 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-900/30",
    dotColor: "bg-rose-500",
  },
};

function getCurrentStage(session: QuerySession): string {
  if (session.steps.length === 0) return "Starting";

  return session.steps[session.steps.length - 1].step
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RequestOverview({ session }: Props) {
  if (!session) return null;

  const status = STATUS_META[session.workflowStatus] || STATUS_META.running;

  return (
    <section className="bg-slate-50 dark:bg-gray-800/10 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 w-full min-w-0 flex flex-col select-none">
      <div className="flex items-start justify-between gap-3 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
            Current Request
          </div>
          <h2 
            className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate select-text leading-snug" 
            title={session.query}
          >
            {session.query}
          </h2>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold select-none whitespace-nowrap flex-shrink-0 ${status.bgColor} ${status.textColor} ${status.borderColor}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
          {status.label.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 w-full min-w-0">
        <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 p-2 rounded-lg min-w-0">
          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase select-none mb-0.5">
            Stage
          </span>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate" title={getCurrentStage(session)}>
            {getCurrentStage(session)}
          </span>
        </div>

        <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 p-2 rounded-lg min-w-0 justify-between">
          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase select-none mb-1">
            Risk
          </span>
          <div className="flex items-center min-w-0">
            <RiskBadge session={session} />
          </div>
        </div>

        <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 p-2 rounded-lg min-w-0">
          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase select-none mb-0.5">
            Started
          </span>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
            {session.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 p-2 rounded-lg min-w-0">
          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-550 uppercase select-none mb-0.5">
            Steps Completed
          </span>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
            {session.steps.length}
          </span>
        </div>
      </div>
    </section>
  );
}
