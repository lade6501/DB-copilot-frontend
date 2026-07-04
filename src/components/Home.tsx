import { useEffect, useRef, useState } from "react";

import { QueryInput } from "./QueryInput";
import { StepCard } from "./StepCard";
import { useWebSocket } from "../hooks/useWebSocket";
import type { QuerySession } from "../types/index";
import ResultPanel from "./ResultPanel";

const BUSINESS_STATUS_MAP: Record<string, string> = {
  start: "Securing database connection...",
  interpret: "Understanding your question...",
  plan: "Scanning database schema...",
  generate_query: "Translating to database language...",
  validate: "Running security checks...",
  execute: "Fetching your records...",
  summary: "Formatting the final report...",
};

function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
}: {
  sessions: QuerySession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="sidebar">
      <span className="sidebar__label">History Logs</span>
      {sessions.length === 0 && (
        <span className="sidebar__empty">No active sessions</span>
      )}
      {sessions.map((s) => (
        <div
          key={s.id}
          className={`session-item ${s.id === activeSessionId ? "session-item--active" : ""}`}
          onClick={() => onSelect(s.id)}
        >
          <div className="session-item__query">{s.query}</div>
          <div className="session-item__meta">
            <span
              className={`session-item__dot session-item__dot--${s.status}`}
            />
            {s.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}
            {s.steps.filter((st) => st.step !== "done").length} steps
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Home() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    isConnecting,
    sendQuery,
  } = useWebSocket();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [devMode, setDevMode] = useState(true);

  const stepsEndRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const isRunning = activeSession?.status === "running" || isConnecting;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!inputBarRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].borderBoxSize[0].blockSize;
      inputBarRef.current?.parentElement?.style.setProperty(
        "--input-bar-height",
        `${h}px`,
      );
    });
    ro.observe(inputBarRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.steps.length, devMode]);

  const rawVisibleSteps = (activeSession?.steps ?? []).filter(
    (s) => s.step !== "done",
  );

  const displaySteps = rawVisibleSteps;

  const summaryStep = activeSession?.steps.find((s) => s.step === "summary");
  const naturalSummary = summaryStep?.summary?.natural_summary;

  const latestStep = rawVisibleSteps[rawVisibleSteps.length - 1];
  const activeStep = latestStep?.step || "start";
  const friendlyMessage = BUSINESS_STATUS_MAP[activeStep] || "Processing...";

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <div className="topbar__logo">
            <div className="topbar__logo-icon">⚡</div>
            DB Copilot
          </div>
          <div className="topbar__status">
            <span className="topbar__status-dot" />
            ws://localhost:8000
          </div>
        </div>

        <div className="topbar__right">
          <div className="mode-toggle">
            <span
              className={`mode-toggle__label ${!devMode ? "mode-toggle__label--active" : ""}`}
            >
              Business
            </span>
            <button
              className={`mode-switch ${devMode ? "mode-switch--on" : ""}`}
              onClick={() => setDevMode(!devMode)}
              aria-label="Toggle Developer Mode"
            >
              <span className="mode-switch__thumb" />
            </button>
            <span
              className={`mode-toggle__label ${devMode ? "mode-toggle__label--active" : ""}`}
            >
              Developer
            </span>
          </div>

          <div className="topbar__divider" />

          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.22" x2="5.64" y2="17.76" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSessionId}
      />

      <main className="main">
        {isRunning && <div className="running-bar" />}

        <div
          className="main__steps"
          style={{ bottom: "var(--input-bar-height, 140px)" }}
        >
          {rawVisibleSteps.length === 0 ? (
            isRunning ? (
              <div className="business-canvas">
                <div className="business-pulse-ring">
                  <div className="business-pulse-core">⚡</div>
                </div>
                <h3 className="business-canvas__title">Initializing</h3>
                <p className="business-canvas__subtitle">
                  Connecting to database...
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <div className="empty-state__title">
                  Ask your database anything
                </div>
                <div className="empty-state__sub">
                  Type a query below. Use Developer Mode to see the underlying
                  SQL generation.
                </div>
              </div>
            )
          ) : (
            <>
              {!devMode ? (
                isRunning ? (
                  <div className="business-canvas">
                    <div className="business-pulse-ring">
                      <div className="business-pulse-core">⚡</div>
                    </div>
                    <h3 className="business-canvas__title">Analyzing Data</h3>
                    <p className="business-canvas__subtitle">
                      {friendlyMessage}
                    </p>
                  </div>
                ) : (
                  <div className="business-canvas business-canvas--success">
                    <div className="business-pulse-ring business-pulse-ring--success">
                      <div className="business-pulse-core">✓</div>
                    </div>
                    <h3 className="business-canvas__title">
                      Analysis Complete
                    </h3>
                    <p className="business-canvas__subtitle">
                      {activeSession?.result
                        ? `Successfully retrieved ${activeSession.result.rows_returned} rows.`
                        : "Query executed successfully."}
                    </p>

                    {naturalSummary && (
                      <div className="business-canvas__prose">
                        {naturalSummary}
                      </div>
                    )}
                  </div>
                )
              ) : (
                displaySteps.map((step, i) => (
                  <StepCard key={`${step.step}-${i}`} step={step} index={i} />
                ))
              )}
            </>
          )}

          <div ref={stepsEndRef} />
        </div>

        <div className="input-bar" ref={inputBarRef}>
          <QueryInput
            onSubmit={sendQuery}
            loading={isRunning}
            connected={!isConnecting}
          />
        </div>
      </main>

      <ResultPanel session={activeSession} />
    </div>
  );
}
