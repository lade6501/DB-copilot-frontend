import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Step, SummaryData } from "../types/index";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const STEP_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; description: string }
> = {
  start: {
    label: "Session Initiated",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 16 16 12 12 8" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </Icon>
    ),
    color: "#64748b",
    description: "Handshaking with real-time database agent",
  },
  interpret: {
    label: "Interpreting Intent",
    icon: (
      <Icon>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </Icon>
    ),
    color: "var(--step-interpret, var(--blue))",
    description: "Parsing natural language query token trees",
  },
  plan: {
    label: "Planning Execution Path",
    icon: (
      <Icon>
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </Icon>
    ),
    color: "var(--step-plan, var(--blue))",
    description: "Mapping logical constraints to schema indices",
  },
  generate_query: {
    label: "Generating SQL Syntax",
    icon: (
      <Icon>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </Icon>
    ),
    color: "var(--step-generate, var(--accent))",
    description: "Compiling optimized engine dialect code",
  },
  validate: {
    label: "Validating Safety Constraints",
    icon: (
      <Icon>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </Icon>
    ),
    color: "var(--step-validate, var(--green))",
    description: "Evaluating read-isolation & syntax security checks",
  },
  impact_analysis: {
    label: "Impact Analysis",
    icon: (
      <Icon>
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </Icon>
    ),
    color: "var(--blue)",
    description: "Calculating affected rows and table surface area",
  },
  risk_analysis: {
    label: "Risk Analysis",
    icon: (
      <Icon>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </Icon>
    ),
    color: "var(--amber)",
    description: "Evaluating query destructive potential and thresholds",
  },
  policy_check: {
    label: "Policy Check",
    icon: (
      <Icon>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </Icon>
    ),
    color: "var(--blue)",
    description: "Evaluating against workspace governance rules",
  },
  approval_required: {
    label: "Approval Required",
    icon: (
      <Icon>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </Icon>
    ),
    color: "var(--amber)",
    description: "Execution paused pending manual authorization",
  },
  blocked: {
    label: "Execution Blocked",
    icon: (
      <Icon>
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </Icon>
    ),
    color: "var(--red)",
    description: "Operation halted due to safety rule violations",
  },
  execute: {
    label: "Executing Relational Query",
    icon: (
      <Icon>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </Icon>
    ),
    color: "var(--step-execute, var(--accent))",
    description: "Streaming active transactional blocks",
  },
  summary: {
    label: "Run Summary Matrix",
    icon: (
      <Icon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </Icon>
    ),
    color: "var(--step-summary, var(--green))",
    description: "Performance benchmarks and record outputs",
  },
  error: {
    label: "Pipeline Exception",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </Icon>
    ),
    color: "var(--step-error, var(--red))",
    description: "Operational failure during processing run",
  },
};

interface StepCardProps {
  step: Step;
  index: number;
}

// Expandable Content Component
function CollapsibleExplanation({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 150;

  if (!isLong) {
    return (
      <div className="pipeline-explanation">
        <div className="pipeline-explanation__text markdown-body">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="pipeline-explanation">
      <button
        className="pipeline-explanation__toggle"
        onClick={() => setExpanded(!expanded)}
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
        <div className="pipeline-explanation__content">
          <div className="pipeline-explanation__text markdown-body">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// Terminal Code Block
function SqlBlock({
  sql,
  label = "process.sql",
}: {
  sql: string;
  label?: string;
}) {
  return (
    <div className="terminal-window">
      <div className="terminal-window__header">
        <div className="terminal-window-controls">
          <span className="tw-dot tw-dot--close" />
          <span className="tw-dot tw-dot--minimize" />
          <span className="tw-dot tw-dot--expand" />
        </div>
        <span className="terminal-window__title">{label}</span>
        <span className="terminal-window__lang">SQL</span>
      </div>
      <div className="terminal-window__body">
        <pre>
          <code>{sql}</code>
        </pre>
      </div>
    </div>
  );
}

function DataChips({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="pipeline-chips">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="pipeline-chip">
          <span className="pipeline-chip__key">{k.replace(/_/g, " ")}</span>
          <span className="pipeline-chip__val">
            {Array.isArray(v) ? v.join(", ") || "—" : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckPills({ checks }: { checks: string[] }) {
  return (
    <div className="pipeline-chips">
      {checks.map((c) => (
        <div key={c} className="pipeline-chip pipeline-chip--success">
          <span className="pipeline-chip__val">✓ {c}</span>
        </div>
      ))}
    </div>
  );
}

function ExecMeta({ time, rows }: { time: number; rows?: number }) {
  return (
    <div className="pipeline-metrics">
      <div className="pipeline-metric">
        <span className="pipeline-metric__label">LATENCY</span>
        <span className="pipeline-metric__val">
          {(time * 1000).toFixed(1)}ms
        </span>
      </div>
      {rows !== undefined && (
        <div className="pipeline-metric">
          <span className="pipeline-metric__label">VOLUME</span>
          <span className="pipeline-metric__val">
            {rows} row{rows !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ summary }: { summary: SummaryData }) {
  return (
    <div className="pipeline-summary">
      {summary.natural_summary && (
        <p className="pipeline-summary__prose">{summary.natural_summary}</p>
      )}
      <div className="pipeline-summary__grid">
        <div className="pipeline-summary__stat">
          <span className="pipeline-summary__stat-label">Rows Affected</span>
          <span className="pipeline-summary__stat-val">
            {summary.rows_returned}
          </span>
        </div>
        <div className="pipeline-summary__stat">
          <span className="pipeline-summary__stat-label">Execution Time</span>
          <span className="pipeline-summary__stat-val">
            {summary.execution_time_ms.toFixed(1)}ms
          </span>
        </div>
        <div className="pipeline-summary__stat">
          <span className="pipeline-summary__stat-label">
            Intent Classification
          </span>
          <span className="pipeline-summary__stat-val">{summary.intent}</span>
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

export function StepCard({ step, index }: StepCardProps) {
  const meta = STEP_META[step.step] ?? {
    label: step.step.replace(/_/g, " "),
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
      </Icon>
    ),
    color: "var(--accent)",
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


  if (String(step.step) === "approval_required" && rawStatus === "completed") {
    status = "pending";
  }

  const textMessage =
    typeof step.explanation === "string" && step.explanation.length > 0
      ? step.explanation
      : typeof step.message === "string" && step.message.length > 0
        ? step.message
        : null;

  // SMART EXTRACTION: Dynamically grab top-level backend keys
  const chipData: Record<string, unknown> = {
    ...(typeof step.data === "object" && step.data !== null ? step.data : {}),
  };

  const ignoreKeys = [
    "step",
    "explanation",
    "message",
    "query",
    "executed_query",
    "execution_time",
    "row_count",
    "summary",
    "error",
    "data",
    "checks",
  ];

  if (String(step.step) !== "approval_required") {
    ignoreKeys.push("status");
  }

  Object.entries(step).forEach(([key, val]) => {
    if (
      !ignoreKeys.includes(key) &&
      val !== null &&
      val !== undefined &&
      (typeof val === "string" ||
        typeof val === "number" ||
        typeof val === "boolean")
    ) {
     
      if (
        (String(step.step) === "approval_required" &&
          key === "status" &&
          val === "completed") ||
        val === "COMPLETED"
      ) {
        chipData[key] = "pending";
      } else {
        chipData[key] = val;
      }
    }
  });

  
  if (String(step.step) === "policy_check" && "allowed" in chipData) {
    chipData["message"] = chipData["allowed"]
      ? "Policy passed"
      : "Policy rules violated";
    delete chipData["allowed"];
  }

  const hasChips = Object.keys(chipData).length > 0;

  return (
    <div
      className={`pipeline-node pipeline-node--${status}`}
      style={
        {
          "--node-color": meta.color,
          animationDelay: `${index * 40}ms`,
        } as React.CSSProperties
      }
    >
      <div className="pipeline-node__track">
        <div className="pipeline-node__indicator">
          {status === "in_progress" ? (
            <div className="pipeline-node__spinner" />
          ) : (
            <span className="pipeline-node__icon">{meta.icon}</span>
          )}
        </div>
        <div className="pipeline-node__line" />
      </div>

      <div className="pipeline-node__content">
        <div className="pipeline-node__header">
          <div className="pipeline-node__titles">
            <h3
              className="pipeline-node__title"
              style={{ textTransform: "capitalize" }}
            >
              {meta.label}
            </h3>
            {meta.description && (
              <p className="pipeline-node__subtitle">{meta.description}</p>
            )}
          </div>
          <div className="pipeline-node__badges">
            {step.execution_time !== undefined && (
              <span className="pipeline-node__time">
                {(step.execution_time * 1000).toFixed(1)}ms
              </span>
            )}
            <span className={`pipeline-tag pipeline-tag--${status}`}>
              {status === "in_progress"
                ? "Streaming"
                : status === "pending"
                  ? "Pending"
                  : status === "completed"
                    ? "Completed"
                    : "Halted"}
            </span>
          </div>
        </div>

        <div className="pipeline-node__body">
          {textMessage && <CollapsibleExplanation text={textMessage} />}

          {hasChips && step.step !== "validate" && (
            <DataChips data={chipData} />
          )}

          {step.step === "generate_query" &&
            (step.query ?? step.executed_query) != null && (
              <SqlBlock
                sql={(step.query ?? step.executed_query)!}
                label="Compiled Execution Code"
              />
            )}

          {step.step === "validate" &&
            (step.data as { checks?: string[] })?.checks && (
              <CheckPills
                checks={(step.data as { checks?: string[] }).checks ?? []}
              />
            )}

          {step.step === "execute" && (
            <div className="pipeline-execute-wrapper">
              {(step.query ?? step.executed_query) != null && (
                <SqlBlock
                  sql={(step.query ?? step.executed_query)!}
                  label="Active Dialect Run"
                />
              )}
              {step.execution_time !== undefined && (
                <ExecMeta time={step.execution_time} rows={step.row_count} />
              )}
            </div>
          )}

          {step.step === "summary" && step.summary != null && (
            <SummaryPanel summary={step.summary} />
          )}

          {typeof step.error === "string" && step.error.length > 0 && (
            <div className="pipeline-node__error-msg">{step.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
