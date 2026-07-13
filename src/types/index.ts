export type StepStatus = "idle" | "in_progress" | "completed" | "error";

export type StepType =
  | "start"
  | "interpret"
  | "plan"
  | "generate_query"
  | "validate"
  | "impact_analysis"
  | "risk_analysis"
  | "policy_check"
  | "approval_required"
  | "approval_requested"
  | "approval_approved"
  | "approval_rejected"
  | "execution_started"
  | "execute"
  | "execution_completed"
  | "result_ready"
  | "summary"
  | "done"
  | "error";

export interface SummaryData {
  intent: string;
  sql: string;
  rows_returned: number;
  execution_time_ms: number;
  tables_used: string[];
  safety_checks: string[];
  natural_summary: string;
}

export interface QueryResult {
  action: "read" | "write" | "update" | "delete";

  entity: string;

  executed_query: string;

  success: boolean;

  execution_time: number;

  rows_returned: number;

  rows_affected: number;

  affected_ids: Array<number | string>;

  data: Record<string, unknown>[];

  message: string;
}

export interface Step {
  step: StepType;

  status?: StepStatus;

  query?: string;

  executed_query?: string;

  explanation?: string;

  data?: Record<string, unknown>;

  result?: QueryResult;

  execution_time?: number;

  row_count?: number;

  error?: string;

  summary?: SummaryData;

  message?: string;

  approval?: ApprovalInfo;

  execution?: ExecutionInfo;

  audit?: AuditInfo;

  [key: string]: unknown;
}

export interface QuerySession {
  id: string;

  query: string;

  timestamp: Date;

  steps: Step[];

  status: "running" | "completed" | "error";

  workflowStatus: WorkflowStatus;

  success: boolean;

  result?: QueryResult;

  approval?: ApprovalInfo;

  approvalId?: string;

  polling?: boolean;

  execution?: ExecutionInfo;

  audit?: AuditInfo;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface ApiErrorResponse {
  detail: string;
  code: string;
}

export type WorkflowStatus =
  | "running"
  | "awaiting_approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rejected";

export interface ApprovalInfo {
  approval_id: string;

  status: string;

  risk_level?: string;

  rows_affected?: number;

  approval_comment?: string;

  workflow_state: WorkflowSnapshot;

  approved_at?: string;

  executed_at?: string;

  failed_at?: string;

  created_at?: string;
}

export interface ExecutionInfo {
  transactionId?: string;

  startedAt?: string;

  completedAt?: string;

  durationMs?: number;

  rowsAffected?: number;

  committed?: boolean;
}

export interface AuditInfo {
  workflowId?: string;

  requestId?: string;

  correlationId?: string;
}

export interface ApprovalPayload {
  approval_id: string;
  status: string;
  risk_level: string;
  rows_affected: number;
}

export interface WorkflowSnapshot {
  version: number;

  user: Record<string, unknown>;

  input: Record<string, unknown>;

  interpretation: Record<string, unknown>;

  plan: Record<string, unknown>;

  sql: Record<string, unknown>;

  impact: Record<string, unknown>;

  risk: Record<string, unknown>;

  policy: Record<string, unknown>;

  metadata: Record<string, unknown>;

  result?: QueryResult;
}
