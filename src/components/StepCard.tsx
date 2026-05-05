import type { Step } from "../types";

const STEP_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  interpret: {
    label: "Interpreting Query",
    icon: "🔍",
    color: "var(--step-interpret)",
  },
  plan: {
    label: "Planning Execution",
    icon: "🗺",
    color: "var(--step-plan)",
  },
  generate_query: {
    label: "Generating SQL",
    icon: "⚙",
    color: "var(--step-generate)",
  },
  validate: {
    label: "Validating Safety",
    icon: "🛡",
    color: "var(--step-validate)",
  },
  execute: {
    label: "Executing Query",
    icon: "⚡",
    color: "var(--step-execute)",
  },
};

interface StepCardProps {
  step: Step;
  index: number;
}

export function StepCard({ step, index }: StepCardProps) {
  const meta = STEP_META[step.step] ?? {
    label: step.step,
    icon: "•",
    color: "#888",
  };
  const status = step.status ?? "in_progress";

  return (
    <div
      className={`step-card step-card--${status}`}
      style={
        {
          "--step-color": meta.color,
          animationDelay: `${index * 60}ms`,
        } as React.CSSProperties
      }
    >
      <div className="step-card__header">
        <div className="step-card__icon-wrap">
          <span className="step-card__icon">{meta.icon}</span>
          {status === "in_progress" && <span className="step-card__pulse" />}
        </div>
        <div className="step-card__meta">
          <span className="step-card__label">{meta.label}</span>
          <span className={`step-card__badge step-card__badge--${status}`}>
            {status === "in_progress"
              ? "Running"
              : status === "completed"
                ? "Done"
                : "Failed"}
          </span>
        </div>
        {step.execution_time !== undefined && (
          <span className="step-card__time">
            {(step.execution_time * 1000).toFixed(1)}ms
          </span>
        )}
      </div>

      {(step.query ?? step.executed_query) && (
        <div className="step-card__sql">
          <code>{step.query ?? step.executed_query}</code>
        </div>
      )}

      {step.data &&
        typeof step.data === "object" &&
        Object.keys(step.data).length > 0 && (
          <div className="step-card__data">
            <pre>{JSON.stringify(step.data, null, 2)}</pre>
          </div>
        )}

      {step.error && <div className="step-card__error">{step.error}</div>}
    </div>
  );
}
