import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Icon, STEP_META } from "./StepMeta";
import type { Step, SummaryData } from "../../types/index";
import { buildChipData, approvalSteps, STATUS_LABELS } from "./utils";

interface StepCardProps {
  step: Step;
  index: number;
}

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
        <div className="pipeline-execute-wrapper">
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
              {STATUS_LABELS[status] ?? "Unknown"}
            </span>
          </div>
        </div>

        <div className="pipeline-node__body">
          {textMessage && <CollapsibleExplanation text={textMessage} />}

          {hasChips && step.step !== "validate" && (
            <DataChips data={chipData} />
          )}

          {renderStepContent(step)}

          {typeof step.error === "string" && step.error.length > 0 && (
            <div className="pipeline-node__error-msg">{step.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
