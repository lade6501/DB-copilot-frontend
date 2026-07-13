import type { Step } from "../../../types/index";


export const STATUS_LABELS: Record<string, string> = {
  in_progress: "Streaming",
  pending: "Pending",
  completed: "Completed",
  error: "Failed",
};

export const approvalSteps = [
  "approval_required",
  "approval_requested",
  "approval_approved",
  "approval_rejected",
];

export const executionSteps = [
  "execution_started",
  "execute",
  "execution_completed",
  "result_ready",
];

export function buildChipData(step: Step): Record<string, unknown> {
  const chipData: Record<string, unknown> = {
    ...(typeof step.data === "object" && step.data !== null
      ? (step.data as Record<string, unknown>)
      : {}),
  };

  const ignoreKeys = [
    "step",
    "status",
    "query",
    "executed_query",
    "explanation",
    "message",
    "execution_time",
    "row_count",
    "summary",
    "error",
    "data",
    "checks",
    "approval",
    "execution",
    "audit",
  ];

  Object.entries(step).forEach(([key, value]) => {
    if (ignoreKeys.includes(key) || value === undefined || value === null) {
      return;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      chipData[key] = value;
    }
  });

  if (step.step === "policy_check" && "allowed" in chipData) {
    chipData.message = chipData.allowed ? "Policy Passed" : "Policy Failed";

    delete chipData.allowed;
  }

  return chipData;
}
