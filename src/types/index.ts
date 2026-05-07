export type StepStatus = "idle" | "in_progress" | "completed" | "error";

export type StepType =
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

export interface Step {
  step: StepType;
  status?: StepStatus;
  query?: string;
  executed_query?: string;
  explanation?: string | undefined;
  data?: unknown;
  result?: Record<string, unknown>[];
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
  result?: Record<string, unknown>[];
}
