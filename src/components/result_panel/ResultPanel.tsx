import EmptyState from "./EmptyState";
import CrudActionCard from "./CrudActionCard";
import ReadResultTable from "./ReadResultTable";
import RequestStatusCard from "./RequestStatusCard";
import { RiskBadge } from "../RiskBadge";

import type { QuerySession } from "../../types";
import "./style.css";

interface Props {
  session: QuerySession | null;
  devMode?: boolean;
}

export function isAwaitingApproval(session: QuerySession | null): boolean {
  if (!session) return false;
  if (session.workflowStatus === "awaiting_approval") return true;

  const hasApproval = !!session.approvalId;
  const isRejected = session.workflowStatus === "rejected" || session.steps.some(s => s.step === "approval_rejected");
  const isApproved = session.workflowStatus === "approved" || session.steps.some(s => s.step === "approval_approved");
  const hasExecuted = !!session.result;

  return hasApproval && !isRejected && !isApproved && !hasExecuted;
}

export default function ResultPanel({ session, devMode = true }: Props) {
  const panelStyle = { borderLeft: "none", width: "100%", height: "100%" };

  if (!session) {
    return (
      <aside className="result-panel" style={panelStyle}>
        <EmptyState />
      </aside>
    );
  }

  if (isAwaitingApproval(session)) {
    return (
      <aside className="result-panel flex items-center justify-center p-6 bg-slate-50 dark:bg-gray-950" style={panelStyle}>
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 shadow-md flex flex-col items-center text-center select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse ring-4 ring-amber-500/5">
            🔒
          </div>
          
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-2">
            Query Awaiting Authorization
          </h3>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
            This query requires administrative authorization before it can be executed. 
            An approval request has been successfully raised.
          </p>

          <div className="w-full bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-800 rounded-xl p-3.5 space-y-2.5 text-left mb-5 text-xs">
            {session.approvalId && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-450 dark:text-gray-500 font-semibold uppercase text-[9px] tracking-wide">Request ID</span>
                <span className="font-mono text-[10px] text-gray-600 dark:text-gray-300 select-all bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700/80">
                  {session.approvalId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-450 dark:text-gray-500 font-semibold uppercase text-[9px] tracking-wide">Risk Assessment</span>
              <RiskBadge session={session} />
            </div>
          </div>

          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-900/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-450 leading-normal text-left">
            💡 <strong>Next Steps:</strong> You can get in touch with your Database Approver / System Administrator to get this query reviewed and authorized.
          </div>
        </div>
      </aside>
    );
  }

  if (
    session.workflowStatus !== "completed" &&
    session.workflowStatus !== "failed"
  ) {
    return (
      <aside className="result-panel" style={panelStyle}>
        <RequestStatusCard session={session} />
      </aside>
    );
  }

  if (!session.result) {
    return (
      <aside className="result-panel" style={panelStyle}>
        <EmptyState />
      </aside>
    );
  }

  return (
    <aside className="result-panel" style={panelStyle}>
      {session.result.action === "read" && (
        <ReadResultTable result={session.result} />
      )}

      {["write", "update", "delete"].includes(session.result.action) && (
        <CrudActionCard result={session.result} devMode={devMode} />
      )}
    </aside>
  );
}
