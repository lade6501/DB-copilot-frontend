import { useState, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { QueryInput } from "./QueryInput";
import ResultPanel from "./result_panel/ResultPanel";
import AgentPanel from "./AgentPanel";
import { useWebSocket } from "../hooks/useWebSocket";
import { useApprovalPolling } from "../hooks/useApprovalPolling";

export default function Home() {
  const {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    isConnecting,
    sendQuery,
  } = useWebSocket();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [devMode, setDevMode] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isAgentCollapsed, setIsAgentCollapsed] = useState(false);
  const [agentWidth, setAgentWidth] = useState(320);

  const isRunning = activeSession?.status === "running" || isConnecting;

  useApprovalPolling({
    approvalId: activeSession?.approvalId,
    enabled: activeSession?.polling ?? false,
    onCompleted: (approval) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== activeSession?.id) return session;

          const updatedSteps = [...session.steps];
          const hasApproved = approval.status.toLowerCase() === "approved";
          const targetStep = hasApproved
            ? ("approval_approved" as const)
            : ("approval_rejected" as const);

          const existingIdx = updatedSteps.findIndex(
            (st) => st.step === targetStep,
          );

          const approvalStep = {
            step: targetStep,
            status: "completed" as const,
            message: `Approval request was ${approval.status.toLowerCase()}`,
            timestamp: new Date().toISOString(),
          };

          if (existingIdx >= 0) {
            updatedSteps[existingIdx] = approvalStep;
          } else {
            updatedSteps.push(approvalStep);
          }

          return {
            ...session,
            polling: false,
            workflowStatus: hasApproved ? "approved" : "rejected",
            status: hasApproved ? "running" : "error",
            steps: updatedSteps,
          };
        }),
      );
    },
  });

  const isResizingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 245 && newWidth <= 600) {
      setAgentWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-200">
      <header className="flex items-center justify-between px-6 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="font-bold text-base text-gray-850 dark:text-white tracking-wide">
            DB Copilot
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              ws://localhost:8000
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-0.5 rounded-full text-xs font-semibold select-none">
            <button
              onClick={() => setDevMode(false)}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                !devMode
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-450 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setDevMode(true)}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                devMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-450 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Developer
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? (
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
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
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
            >
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-150 dark:border-gray-700 py-1 z-50">
                <a
                  href="#"
                  className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-250 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-250 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
                >
                  Settings
                </a>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <a
                  href="#"
                  className="block px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 relative w-full">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={setActiveSessionId}
          onClear={() => setSessions([])}
          isCollapsed={isHistoryCollapsed}
          onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
        />

        <main className="flex-1 min-w-0 flex flex-col bg-slate-50 dark:bg-gray-950 p-4 md:p-6 gap-4 h-full overflow-hidden">
          <div className="flex-shrink-0">
            <QueryInput
              onSubmit={sendQuery}
              loading={isRunning}
              connected={!isConnecting}
            />
          </div>

          <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {isRunning && (
              <div className="h-1 w-full bg-indigo-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] flex-shrink-0" />
            )}
            <div className="flex-1 min-h-0 relative">
              <ResultPanel session={activeSession} />
            </div>
          </div>
        </main>

        {!isAgentCollapsed && (
          <div
            className="w-[3px] hover:w-[6px] hover:bg-indigo-500/50 bg-gray-200/50 dark:bg-gray-800/80 cursor-col-resize transition-all self-stretch z-10 flex-shrink-0"
            onMouseDown={handleMouseDown}
          />
        )}

        <AgentPanel
          session={activeSession}
          isRunning={isRunning}
          isCollapsed={isAgentCollapsed}
          onToggleCollapse={() => setIsAgentCollapsed(!isAgentCollapsed)}
          width={agentWidth}
        />
      </div>
    </div>
  );
}
