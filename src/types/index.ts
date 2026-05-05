export type StepStatus = "pending" | "in_progress" | "completed" | "error";

export type StepName =
  | "interpret"
  | "plan"
  | "generate_query"
  | "validate"
  | "execute"
  | "done";

export interface Step {
  step: StepName | string;
  status?: StepStatus;
  query?: string;
  executed_query?: string;
  data?: Record<string, unknown>;
  result?: Record<string, unknown>[];
  execution_time?: number;
  row_count?: number;
  error?: string;
}

export interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  rowCount?: number;
  success: boolean;
}
