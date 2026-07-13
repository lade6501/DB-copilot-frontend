import { useState } from "react";
import type { QuerySession } from "../types";
import RequestOverview from "./requestoverview/RequestOverview";
import { StepCard } from "./steps_card/StepCard";

interface Props {
  session: QuerySession | null;
  isRunning?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
}

export default function AgentPanel({
  session,
  isRunning = false,
  isCollapsed,
  onToggleCollapse,
  width,
}: Props) {
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  const getStatusLabel = () => {
    if (!session) return "Idle";
    if (isRunning) return "Running";
    if (session.status === "completed") return "Completed";
    return "Failed";
  };

  const getStatusColorClass = () => {
    if (!session) return "text-gray-400 dark:text-gray-550 bg-gray-100 dark:bg-gray-800";
    if (isRunning) return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20";
    if (session.status === "completed") return "text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20";
    return "text-rose-700 dark:text-rose-455 bg-rose-50 dark:bg-rose-955/20";
  };

  const handleToggleCard = (index: number) => {
    setExpandedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isCollapsed) {
    return (
      <aside className="h-full flex flex-col bg-slate-50/50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-850 flex-shrink-0 w-[44px]">
        <div className="flex items-center justify-center p-3 border-b border-gray-250/60 dark:border-gray-800/80 min-h-[53px]">
          <button
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded hover:bg-gray-105 dark:hover:bg-gray-800 cursor-pointer"
            onClick={onToggleCollapse}
            title="Expand Panel"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest vertical-rl select-none">
            Agent Timeline
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className="h-full flex flex-col bg-slate-50/50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-850 flex-shrink-0 w-full min-w-0"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-250/60 dark:border-gray-800/80 min-h-[53px] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase select-none">
            Agent
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded select-none ${getStatusColorClass()}`}>
            {getStatusLabel().toUpperCase()}
          </span>
        </div>

        <button
          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded hover:bg-gray-105 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          onClick={onToggleCollapse}
          title="Collapse Panel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-w-0 w-full">
        {session ? (
          <>
            <RequestOverview session={session} />

            <div className="text-[9px] font-bold text-gray-400 dark:text-gray-505 uppercase tracking-wider select-none mb-1">
              Execution Timeline
            </div>

            <div className="flex flex-col w-full min-w-0">
              {session.steps.map((step, idx) => {
                const isExpanded = expandedMap[idx] ?? true;
                return (
                  <StepCard
                    key={idx}
                    step={step}
                    index={idx}
                    isExpanded={isExpanded}
                    onToggle={() => handleToggleCard(idx)}
                    isLast={idx === session.steps.length - 1}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none text-gray-400">
            <span className="text-3xl mb-2">🤖</span>
            <p className="text-xs font-semibold">No active execution session</p>
            <p className="text-[10px] text-gray-550 mt-1 max-w-[180px] leading-relaxed">
              Submit a database query to launch the planner agent pipeline.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
