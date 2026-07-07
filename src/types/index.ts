export type StepStatus = "idle" | "in_progress" | "completed" | "error";

export type StepType =
  | "start"
  | "interpret"
  | "plan"
  | "generate_query"
  | "validate"
  | "execute"
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

  data?: unknown;

  result?: QueryResult;

  execution_time?: number;

  row_count?: number;

  error?: string;

  summary?: SummaryData;

  message?: string;
}

export interface QuerySession {
  id: string;

  query: string;

  timestamp: Date;

  steps: Step[];

  status: "running" | "completed" | "error";

  success: boolean;

  result?: QueryResult;
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