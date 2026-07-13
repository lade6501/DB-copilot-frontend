import type { QuerySession } from "../types";

interface RiskBadgeProps {
  session?: QuerySession | null;
  risk?: string;
}

export function getSessionRisk(session: QuerySession | null): string {
  if (!session) return "Unknown";
  
  const riskStep = session.steps.find((s) => s.step === "risk_analysis");
  if (!riskStep) {
    if (session.status === "running" || session.workflowStatus === "running" || session.workflowStatus === "executing") {
      return "Pending";
    }
    return "Unknown";
  }

  if ("risk" in riskStep && typeof riskStep.risk === "string") {
    return riskStep.risk;
  }

  const data = riskStep.data as Record<string, unknown> | undefined;
  return (data?.risk_level as string) ?? (data?.risk as string) ?? "Unknown";
}

export function RiskBadge({ session, risk }: RiskBadgeProps) {
  const resolvedRisk = risk ?? getSessionRisk(session ?? null);
  const normalized = resolvedRisk.toLowerCase().replace(/_/g, " ").trim();

  let dotColor = "bg-slate-400 dark:bg-slate-500";
  let textColor = "text-slate-600 dark:text-slate-400";
  let bgColor = "bg-slate-50 dark:bg-slate-900/40";
  let borderColor = "border-slate-200 dark:border-slate-800";
  let label = resolvedRisk;

  if (normalized === "pending" || normalized === "calculating") {
    dotColor = "bg-amber-400 dark:bg-amber-500 animate-pulse";
    textColor = "text-amber-600 dark:text-amber-400";
    bgColor = "bg-amber-50/50 dark:bg-amber-950/10";
    borderColor = "border-amber-200 dark:border-amber-900/20";
    label = "EVALUATING";
  } else if (
    normalized === "safe" ||
    normalized === "low" ||
    normalized === "low risk" ||
    normalized === "read only" ||
    normalized === "read_only"
  ) {
    dotColor = "bg-emerald-500";
    textColor = "text-emerald-700 dark:text-emerald-400";
    bgColor = "bg-emerald-50 dark:bg-emerald-950/20";
    borderColor = "border-emerald-200 dark:border-emerald-900/30";
    label = normalized === "safe" ? "SAFE" : (normalized === "read only" || normalized === "read_only" ? "READ ONLY" : "LOW RISK");
  } else if (normalized === "medium" || normalized === "medium risk") {
    dotColor = "bg-orange-500";
    textColor = "text-orange-700 dark:text-orange-400";
    bgColor = "bg-orange-50 dark:bg-orange-950/15";
    borderColor = "border-orange-200 dark:border-orange-900/30";
    label = "MEDIUM";
  } else if (normalized === "high" || normalized === "high risk") {
    dotColor = "bg-rose-500";
    textColor = "text-rose-700 dark:text-rose-400";
    bgColor = "bg-rose-50 dark:bg-rose-950/20";
    borderColor = "border-rose-200 dark:border-rose-900/30";
    label = "HIGH RISK";
  } else if (normalized === "critical" || normalized === "critical risk") {
    dotColor = "bg-red-600 animate-pulse";
    textColor = "text-red-700 dark:text-red-400";
    bgColor = "bg-red-55 dark:bg-red-955/20";
    borderColor = "border-red-300 dark:border-red-900/30";
    label = "CRITICAL";
  } else if (normalized === "unknown") {
    if (session && (session.status === "running" || session.workflowStatus === "running")) {
      dotColor = "bg-slate-400 animate-pulse";
      textColor = "text-slate-500";
      bgColor = "bg-slate-55/50 dark:bg-slate-900/20";
      borderColor = "border-slate-200 dark:border-slate-800";
      label = "EVALUATING";
    } else {
      dotColor = "bg-emerald-500";
      textColor = "text-emerald-700 dark:text-emerald-400";
      bgColor = "bg-emerald-50 dark:bg-emerald-950/20";
      borderColor = "border-emerald-200 dark:border-emerald-900/30";
      label = "SAFE";
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold tracking-wider select-none ${bgColor} ${textColor} ${borderColor} transition-all duration-300`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label.toUpperCase()}
    </span>
  );
}
