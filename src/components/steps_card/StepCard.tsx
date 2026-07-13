import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Icon, STEP_META } from "./StepMeta";
import type { Step, SummaryData } from "../../types/index";
import { buildChipData, approvalSteps, STATUS_LABELS } from "./utils";

interface StepCardProps {
  step: Step;
  index: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  isLast?: boolean;
}

function CollapsibleExplanation({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full min-w-0">
      <button
        className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-650 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold bg-none border-none cursor-pointer p-0 select-none"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span>
          {expanded ? "Hide thinking process" : "Show thinking process"}
        </span>
      </button>
      {expanded && (
        <div className="mt-2 text-xs leading-relaxed text-gray-655 dark:text-gray-300 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/10 dark:border-indigo-900/15 p-3 rounded-lg">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function SqlBlock({
  sql,
  label = "process.sql",
}: {
  sql: string;
  label?: string;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-slate-905 text-slate-100 w-full min-w-0 max-w-full">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-955/60 border-b border-slate-800 text-[10px] font-semibold text-slate-400 select-none min-w-0 w-full">
        <div className="flex gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="font-mono text-slate-350 truncate px-2 flex-1 text-center">{label}</span>
        <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-400 flex-shrink-0">SQL</span>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed max-h-[300px] w-full max-w-full scrollbar-thin">
        <pre className="m-0 overflow-x-auto whitespace-pre max-w-full">
          <code className="overflow-x-auto whitespace-pre block">{sql}</code>
        </pre>
      </div>
    </div>
  );
}

function DataChips({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 w-full min-w-0 select-none">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800/80 px-2 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300 max-w-full truncate">
          <span className="font-semibold text-gray-450 mr-1">{k.replace(/_/g, " ")}:</span>
          <span className="font-bold text-gray-750 dark:text-gray-200">
            {Array.isArray(v) ? v.join(", ") || "—" : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckPills({ checks }: { checks: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 w-full min-w-0 select-none">
      {checks.map((c) => (
        <div key={c} className="bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-100 dark:border-emerald-900/30 px-2 py-0.5 rounded text-[10px] text-emerald-750 dark:text-emerald-400 font-bold">
          <span>✓ {c}</span>
        </div>
      ))}
    </div>
  );
}

function ExecMeta({ time, rows }: { time: number; rows?: number }) {
  return (
    <div className="flex gap-3 mt-3 w-full min-w-0 select-none">
      <div className="bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-850 rounded px-2.5 py-1 flex flex-col min-w-[70px]">
        <span className="text-[8px] font-bold text-gray-400 tracking-wider">LATENCY</span>
        <span className="text-xs font-bold text-gray-800 dark:text-gray-205">
          {(time * 1000).toFixed(1)}ms
        </span>
      </div>
      {rows !== undefined && (
        <div className="bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-850 rounded px-2.5 py-1 flex flex-col min-w-[70px]">
          <span className="text-[8px] font-bold text-gray-400 tracking-wider">VOLUME</span>
          <span className="text-xs font-bold text-gray-805 dark:text-gray-205">
            {rows} row{rows !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ summary }: { summary: SummaryData }) {
  return (
    <div className="space-y-3 w-full min-w-0 overflow-hidden">
      {summary.natural_summary && (
        <p className="text-xs text-gray-650 dark:text-gray-300 leading-normal">{summary.natural_summary}</p>
      )}
      <div className="grid grid-cols-3 gap-1.5 select-none">
        <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-250/60 dark:border-gray-805/85 p-1.5 rounded flex flex-col min-w-0">
          <span className="text-[8px] font-semibold text-gray-450 uppercase">Affected</span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
            {summary.rows_returned}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-250/60 dark:border-gray-805/85 p-1.5 rounded flex flex-col min-w-0">
          <span className="text-[8px] font-semibold text-gray-455 uppercase">Duration</span>
          <span className="text-xs font-bold text-gray-805 dark:text-gray-100">
            {summary.execution_time_ms.toFixed(1)}ms
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-250/60 dark:border-gray-805/85 p-1.5 rounded flex flex-col min-w-0">
          <span className="text-[8px] font-semibold text-gray-455 uppercase">Intent</span>
          <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100 truncate" title={summary.intent}>
            {summary.intent}
          </span>
        </div>
      </div>
      {summary.sql && (
        <div style={{ marginTop: "14px" }}>
          <SqlBlock sql={summary.sql} label="Final Transformed Statement" />
        </div>
      )}
    </div>
  );
}

function renderStepContent(step: Step) {
  switch (step.step) {
    case "generate_query":
      return (step.query ?? step.executed_query) ? (
        <SqlBlock
          sql={(step.query ?? step.executed_query)!}
          label="Compiled Execution Code"
        />
      ) : null;

    case "validate":
      return (step.data as { checks?: string[] })?.checks ? (
        <CheckPills
          checks={(step.data as { checks?: string[] }).checks ?? []}
        />
      ) : null;

    case "execution_started":
    case "execute":
    case "execution_completed":
    case "result_ready":
      return (
        <div className="space-y-3 w-full min-w-0">
          {(step.query ?? step.executed_query) && (
            <SqlBlock
              sql={(step.query ?? step.executed_query)!}
              label="Active Dialect Run"
            />
          )}

          {step.execution_time !== undefined && (
            <ExecMeta time={step.execution_time} rows={step.row_count} />
          )}
        </div>
      );

    case "summary":
      return step.summary ? <SummaryPanel summary={step.summary} /> : null;

    default:
      return null;
  }
}

export function StepCard({ step, index, isExpanded = true, onToggle, isLast = false }: StepCardProps) {
  const meta = STEP_META[step.step] ?? {
    label: step.step.replace(/_/g, " "),
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
      </Icon>
    ),
    color: "#6366f1",
    description: "",
  };

  const rawStatus = (step.status ?? "in_progress").toLowerCase();
  let status = rawStatus;

  if (
    rawStatus === "completed" &&
    step.step === "generate_query" &&
    !(step.query ?? step.executed_query)
  ) {
    status = "in_progress";
  }

  const isApprovalStep = approvalSteps.includes(step.step);

  if (
    isApprovalStep &&
    step.step !== "approval_approved" &&
    step.step !== "approval_rejected" &&
    rawStatus === "completed"
  ) {
    status = "pending";
  }

  const textMessage =
    typeof step.explanation === "string" && step.explanation.length > 0
      ? step.explanation
      : typeof step.message === "string" && step.message.length > 0
        ? step.message
        : null;

  const chipData: Record<string, unknown> = buildChipData(step);
  const hasChips = Object.keys(chipData).length > 0;

  const getIndicatorStyle = () => {
    switch (status) {
      case "in_progress":
        return "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.35)] animate-pulse ring-4 ring-indigo-500/10 border-0 flex items-center justify-center rounded-full w-8 h-8";
      case "completed":
      case "approved":
      case "completed_success":
        return "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-[0_2px_6px_rgba(16,185,129,0.18)] border-0 flex items-center justify-center rounded-full w-8 h-8";
      case "failed":
      case "rejected":
        return "bg-gradient-to-tr from-rose-500 to-pink-650 text-white shadow-[0_2px_6px_rgba(239,68,68,0.18)] border-0 flex items-center justify-center rounded-full w-8 h-8";
      case "pending":
        return "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-[0_2px_6px_rgba(245,158,11,0.18)] border-0 flex items-center justify-center rounded-full w-8 h-8";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-850 flex items-center justify-center rounded-full w-8 h-8";
    }
  };

  const getStatusTagClass = () => {
    switch (status) {
      case "in_progress":
        return "bg-indigo-50 text-indigo-750 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30 animate-pulse";
      case "completed":
        return "bg-emerald-50 text-emerald-750 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20";
      case "failed":
      case "rejected":
        return "bg-rose-50 text-rose-750 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20";
      case "pending":
        return "bg-amber-50 text-amber-750 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/20";
      default:
        return "bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-800/20 dark:text-gray-555 dark:border-gray-800/60";
    }
  };

  return (
    <div
      className="relative flex gap-4 w-full min-w-0 pb-6"
      style={
        {
          animationName: "slideInUp",
          animationDuration: "0.35s",
          animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          animationFillMode: "forwards",
          animationDelay: `${index * 45}ms`,
          opacity: 0,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="flex flex-col items-center flex-shrink-0 relative w-8">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform duration-200 cursor-pointer ${getIndicatorStyle()} hover:scale-105`}
          onClick={onToggle}
        >
          {status === "in_progress" ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <span className="w-4 h-4 flex items-center justify-center text-white">{meta.icon}</span>
          )}
        </div>
        
        {!isLast && (
          <div className="absolute top-8 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-855" />
        )}
      </div>

      <div 
        className={`flex-1 bg-white dark:bg-gray-900 border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden cursor-pointer min-w-0 w-full hover:shadow-md ${
          status === "in_progress"
            ? "border-indigo-500/40 dark:border-indigo-500/20 shadow-[0_2px_8px_rgba(99,102,241,0.05)] bg-indigo-50/5 dark:bg-indigo-950/5"
            : "border-gray-200/95 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        }`}
        onClick={onToggle}
      >
        <div 
          className={`flex items-center justify-between gap-3 transition-all duration-200 min-w-0 w-full ${
            isExpanded ? "p-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-905/10" : "px-3.5 py-2.5"
          }`}
        >
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              {meta.label}
            </h3>
            {isExpanded && meta.description && (
              <p className="text-[10px] text-gray-400 dark:text-gray-505 leading-tight mt-0.5 font-medium">{meta.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {step.execution_time !== undefined && (
              <span className="text-[9px] font-mono text-indigo-655 bg-indigo-50/80 dark:text-indigo-400 dark:bg-indigo-950/40 border border-indigo-150/40 dark:border-indigo-900/20 px-1.5 py-0.5 rounded-md leading-none font-semibold">
                {(step.execution_time * 1000).toFixed(1)}ms
              </span>
            )}
            
            {isExpanded && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wide ${getStatusTagClass()}`}>
                {STATUS_LABELS[status] ?? "Unknown"}
              </span>
            )}

            {onToggle && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 group-hover:text-gray-655 dark:group-hover:text-gray-300 transition-transform duration-300"
                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-3.5 w-full min-w-0 overflow-hidden">
            {textMessage && (
              step.step === "generate_query" ? (
                <CollapsibleExplanation text={textMessage} />
              ) : (
                <div className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">
                  <ReactMarkdown>{textMessage}</ReactMarkdown>
                </div>
              )
            )}

            {hasChips && step.step !== "validate" && (
              <DataChips data={chipData} />
            )}

            {renderStepContent(step)}

            {typeof step.error === "string" && step.error.length > 0 && (
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-200/50 dark:border-rose-900/20 p-2.5 rounded-lg break-words select-text">{step.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
