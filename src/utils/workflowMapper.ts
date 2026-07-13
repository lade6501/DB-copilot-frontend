import type { Step } from "../types";

export function workflowToSteps(
  workflow: Record<string, any>,
  approvalStatus?: string,
): Step[] {
  const steps: Step[] = [];

  if (workflow.interpretation) {
    steps.push({
      step: "interpret",
      status: "completed",
      data: workflow.interpretation.result,
    });
  }

  if (workflow.plan) {
    steps.push({
      step: "plan",
      status: "completed",
      data: workflow.plan.result,
    });
  }

  if (workflow.sql) {
    steps.push({
      step: "generate_query",
      status: "completed",
      query: workflow.sql.generated_query,
    });
  }

  if (workflow.impact) {
    steps.push({
      step: "impact_analysis",
      status: "completed",
      row_count: workflow.impact.rows_affected,
    });
  }

  if (workflow.risk) {
    steps.push({
      step: "risk_analysis",
      status: "completed",
      risk: workflow.risk.level,
      explanation: workflow.risk.reason,
    });
  }

  if (workflow.policy) {
    steps.push({
      step: "policy_check",
      status: "completed",
      allowed: workflow.policy.allowed,
    });
  }

  if (approvalStatus === "PENDING") {
    steps.push({
      step: "approval_required",
      status: "completed",
    });
  }

  if (approvalStatus === "APPROVED") {
    steps.push({
      step: "approval_approved",
      status: "completed",
    });
  }

  if (approvalStatus === "REJECTED") {
    steps.push({
      step: "approval_rejected",
      status: "completed",
    });
  }

  if (approvalStatus === "EXECUTED") {
    steps.push({
      step: "approval_approved",
      status: "completed",
    });

    steps.push({
      step: "execution_completed",
      status: "completed",
    });
  }

  return steps;
}
