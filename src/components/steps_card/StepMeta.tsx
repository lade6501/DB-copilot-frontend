import React from "react";

export const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const STEP_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; description: string }
> = {
  start: {
    label: "Session Initiated",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 16 16 12 12 8" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </Icon>
    ),
    color: "#64748b",
    description: "Handshaking with real-time database agent",
  },
  interpret: {
    label: "Interpreting Intent",
    icon: (
      <Icon>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </Icon>
    ),
    color: "var(--step-interpret, var(--blue))",
    description: "Parsing natural language query token trees",
  },
  plan: {
    label: "Planning Execution Path",
    icon: (
      <Icon>
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </Icon>
    ),
    color: "var(--step-plan, var(--blue))",
    description: "Mapping logical constraints to schema indices",
  },
  generate_query: {
    label: "Generating SQL Syntax",
    icon: (
      <Icon>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </Icon>
    ),
    color: "var(--step-generate, var(--accent))",
    description: "Compiling optimized engine dialect code",
  },
  validate: {
    label: "Validating Safety Constraints",
    icon: (
      <Icon>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </Icon>
    ),
    color: "var(--step-validate, var(--green))",
    description: "Evaluating read-isolation & syntax security checks",
  },
  impact_analysis: {
    label: "Impact Analysis",
    icon: (
      <Icon>
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </Icon>
    ),
    color: "var(--blue)",
    description: "Calculating affected rows and table surface area",
  },
  risk_analysis: {
    label: "Risk Analysis",
    icon: (
      <Icon>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </Icon>
    ),
    color: "var(--amber)",
    description: "Evaluating query destructive potential and thresholds",
  },
  policy_check: {
    label: "Policy Check",
    icon: (
      <Icon>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </Icon>
    ),
    color: "var(--blue)",
    description: "Evaluating against workspace governance rules",
  },
  approval_required: {
    label: "Approval Required",
    icon: (
      <Icon>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </Icon>
    ),
    color: "var(--amber)",
    description: "Execution paused pending manual authorization",
  },
  blocked: {
    label: "Execution Blocked",
    icon: (
      <Icon>
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </Icon>
    ),
    color: "var(--red)",
    description: "Operation halted due to safety rule violations",
  },
  execute: {
    label: "Executing Relational Query",
    icon: (
      <Icon>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </Icon>
    ),
    color: "var(--step-execute, var(--accent))",
    description: "Streaming active transactional blocks",
  },
  summary: {
    label: "Run Summary Matrix",
    icon: (
      <Icon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </Icon>
    ),
    color: "var(--step-summary, var(--green))",
    description: "Performance benchmarks and record outputs",
  },
  error: {
    label: "Pipeline Exception",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </Icon>
    ),
    color: "var(--step-error, var(--red))",
    description: "Operational failure during processing run",
  },
  approval_requested: {
    label: "Approval Requested",
    icon: (
      <Icon>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </Icon>
    ),
    color: "var(--amber)",
    description: "Request submitted for administrator approval",
  },
  approval_approved: {
    label: "Approval Granted",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <polyline points="8 12 11 15 16 9" />
      </Icon>
    ),
    color: "var(--green)",
    description: "Request approved and execution resumed",
  },
  approval_rejected: {
    label: "Approval Rejected",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </Icon>
    ),
    color: "var(--red)",
    description: "Administrator rejected the request",
  },
  execution_started: {
    label: "Execution Started",
    icon: (
      <Icon>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </Icon>
    ),
    color: "var(--accent)",
    description: "Executing query against database",
  },
  execution_completed: {
    label: "Execution Completed",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <polyline points="8 12 11 15 16 9" />
      </Icon>
    ),
    color: "var(--green)",
    description: "Database execution completed successfully",
  },
  result_ready: {
    label: "Result Ready",
    icon: (
      <Icon>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </Icon>
    ),
    color: "var(--green)",
    description: "Formatting response for presentation",
  },
};
