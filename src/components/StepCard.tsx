import React from "react";
import type { Step, SummaryData } from "../types/index";

const STEP_META: Record<
  string,
  { label: string; icon: string; color: string; description: string }
> = {
  interpret: {
    label: "Interpreting Query",
    icon: "🔍",
    color: "var(--step-interpret)",
    description: "Parsing natural language intent",
  },
  plan: {
    label: "Planning Execution",
    icon: "🗺",
    color: "var(--step-plan)",
    description: "Mapping query to schema",
  },
  generate_query: {
    label: "Generating SQL",
    icon: "⚙",
    color: "var(--step-generate)",
    description: "Writing optimized SQL",
  },
  validate: {
    label: "Validating Safety",
    icon: "🛡",
    color: "var(--step-validate)",
    description: "Running safety & syntax checks",
  },
  execute: {
    label: "Executing Query",
    icon: "⚡",
    color: "var(--step-execute)",
    description: "Running on database",
  },
  summary: {
    label: "Summary",
    icon: "✦",
    color: "var(--step-summary)",
    description: "Overview of this query run",
  },
  done: {
    label: "Done",
    icon: "✓",
    color: "var(--step-done)",
    description: "Query complete",
  },
  error: {
    label: "Error",
    icon: "✕",
    color: "var(--step-error)",
    description: "Something went wrong",
  },
};

interface StepCardProps {
  step: Step;
  index: number;
}

function ExplanationBanner({ text }: { text: string }) {
  return (
    <div className="step-explanation">
      <span className="step-explanation__icon">💬</span>
      <p className="step-explanation__text">{text}</p>
    </div>
  );
}

function SqlBlock({ sql, label = "SQL" }: { sql: string; label?: string }) {
  return (
    <div className="code-block">
      <span className="code-block__label">{label}</span>
      <pre>
        <code>{sql}</code>
      </pre>
    </div>
  );
}

function DataChips({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="data-chips">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="data-chip">
          <span className="data-chip__key">{k}</span>
          <span className="data-chip__val">
            {Array.isArray(v) ? v.join(", ") || "—" : JSON.stringify(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckPills({ checks }: { checks: string[] }) {
  return (
    <div className="data-chips">
      {checks.map((c) => (
        <div key={c} className="data-chip data-chip--success">
          <span className="data-chip__val">✓ {c}</span>
        </div>
      ))}
    </div>
  );
}

function ExecMeta({ time, rows }: { time: number; rows?: number }) {
  return (
    <div className="exec-meta">
      <div className="exec-meta__item">
        <span className="exec-meta__label">time</span>
        <span className="exec-meta__val">{(time * 1000).toFixed(1)}ms</span>
      </div>
      {rows !== undefined && (
        <div className="exec-meta__item">
          <span className="exec-meta__label">rows</span>
          <span className="exec-meta__val">{rows}</span>
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ summary }: { summary: SummaryData }) {
  return (
    <div className="summary-panel">
      {summary.natural_summary && (
        <p className="summary-panel__prose">{summary.natural_summary}</p>
      )}

      <div className="summary-grid">
        <div className="summary-stat">
          <span className="summary-stat__label">Rows returned</span>
          <span className="summary-stat__val">{summary.rows_returned}</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Query time</span>
          <span className="summary-stat__val">
            {summary.execution_time_ms.toFixed(1)}ms
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Intent</span>
          <span className="summary-stat__val">{summary.intent}</span>
        </div>
        {summary.tables_used?.length > 0 && (
          <div className="summary-stat">
            <span className="summary-stat__label">Tables</span>
            <span className="summary-stat__val">
              {summary.tables_used.join(", ")}
            </span>
          </div>
        )}
      </div>

      {summary.sql && (
        <div style={{ marginTop: "12px" }}>
          <SqlBlock sql={summary.sql} label="Final SQL" />
        </div>
      )}

      {summary.safety_checks?.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <CheckPills checks={summary.safety_checks} />
        </div>
      )}
    </div>
  );
}

export function StepCard({ step, index }: StepCardProps) {
  const meta = STEP_META[step.step] ?? {
    label: step.step,
    icon: "•",
    color: "#888",
    description: "",
  };
  const status = step.status ?? "in_progress";

  return (
    <div
      className={`step-card step-card--${status} ${
        step.step === "summary" ? "step-card--summary" : ""
      }`}
      style={
        {
          "--step-color": meta.color,
          animationDelay: `${index * 60}ms`,
        } as React.CSSProperties
      }
    >
      <div className="step-card__header">
        <div className="step-card__icon-wrap">
          {status === "in_progress" ? (
            <span className="spinner" />
          ) : (
            <span className="step-card__icon">{meta.icon}</span>
          )}
          {status === "in_progress" && <span className="step-card__pulse" />}
        </div>

        <div className="step-card__meta">
          <span className="step-card__label">{meta.label}</span>
          <span className="step-card__desc">{meta.description}</span>
        </div>

        <div className="step-card__right">
          {step.execution_time !== undefined && (
            <span className="step-card__time">
              {(step.execution_time * 1000).toFixed(1)}ms
            </span>
          )}
          <span className={`step-badge step-badge--${status}`}>
            {status === "in_progress"
              ? "Running"
              : status === "completed"
                ? "Done"
                : "Failed"}
          </span>
        </div>
      </div>

      {(() => {
        const text =
          typeof step.explanation === "string" && step.explanation.length > 0
            ? step.explanation
            : typeof step.message === "string" && step.message.length > 0
              ? step.message
              : null;
        return text ? (
          <div className="step-card__body">
            <ExplanationBanner text={text} />
          </div>
        ) : null;
      })()}

      {step.step === "interpret" && step.data != null ? (
        <div className="step-card__body">
          <DataChips data={step.data as Record<string, unknown>} />
        </div>
      ) : null}

      {step.step === "plan" && step.data != null ? (
        <div className="step-card__body">
          <DataChips data={step.data as Record<string, unknown>} />
        </div>
      ) : null}

      {step.step === "generate_query" &&
      (step.query ?? step.executed_query) != null ? (
        <div className="step-card__body">
          <SqlBlock sql={(step.query ?? step.executed_query)!} />
        </div>
      ) : null}

      {step.step === "validate" && step.data != null ? (
        <div className="step-card__body">
          <CheckPills
            checks={(step.data as { checks?: string[] }).checks ?? []}
          />
        </div>
      ) : null}

      {step.step === "execute" ? (
        <div className="step-card__body">
          {(step.query ?? step.executed_query) != null ? (
            <SqlBlock
              sql={(step.query ?? step.executed_query)!}
              label="Executed SQL"
            />
          ) : null}
          {step.execution_time !== undefined ? (
            <div style={{ marginTop: "8px" }}>
              <ExecMeta time={step.execution_time} rows={step.row_count} />
            </div>
          ) : null}
        </div>
      ) : null}

      {step.step === "summary" && step.summary != null ? (
        <div className="step-card__body">
          <SummaryPanel summary={step.summary} />
        </div>
      ) : null}

      {typeof step.error === "string" && step.error.length > 0 ? (
        <div className="step-card__body">
          <div className="step-error">{step.error}</div>
        </div>
      ) : null}
    </div>
  );
}
