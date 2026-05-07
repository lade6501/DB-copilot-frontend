import { useEffect, useRef } from "react";
import { QueryInput } from "./components/QueryInput";
import { StepCard } from "./components/StepCard";
import { useWebSocket } from "./hooks/useWebSocket";
import type { QuerySession } from "./types/index";
import "./index.css";

function ResultPanel({ session }: { session: QuerySession | null }) {
  const result = session?.result;
  const columns = result && result.length > 0 ? Object.keys(result[0]) : [];

  return (
    <aside className="result-panel">
      <div className="result-panel__header">
        <span className="result-panel__title">Result</span>
        {result && (
          <span className="result-panel__count">
            {result.length} row{result.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {!result ? (
        <div className="result-panel__empty">Run a query to see results</div>
      ) : (
        <div className="result-panel__scroll">
          <table className="result-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c} title={String(row[c] ?? "")}>
                      {String(row[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </aside>
  );
}

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
      <span className="sidebar__label">History</span>
      {sessions.length === 0 && (
        <span className="sidebar__empty">No queries yet</span>
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
            &nbsp;·&nbsp;{s.steps.filter((st) => st.step !== "done").length}{" "}
            steps
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function App() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    isConnecting,
    sendQuery,
  } = useWebSocket();

  const stepsEndRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const isRunning = activeSession?.status === "running" || isConnecting;

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
  }, [activeSession?.steps.length]);

  const visibleSteps = (activeSession?.steps ?? []).filter(
    (s) => s.step !== "done",
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__logo">
          <span className="topbar__logo-dot" />
          DB Copilot
        </div>
        <div className="topbar__divider" />
        <div className="topbar__status">
          <span className="topbar__status-dot" />
          connected · ws://localhost:8000
        </div>
      </header>

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSessionId}
      />

      <main className="main">
        {isRunning && <div className="running-bar" />}

        <div className="main__steps" data-input-height="true">
          {visibleSteps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">⌥</div>
              <div className="empty-state__title">
                Ask your database anything
              </div>
              <div className="empty-state__sub">
                Type a question below — we'll show you every step live
              </div>
            </div>
          ) : (
            visibleSteps.map((step, i) => (
              <StepCard key={`${step.step}-${i}`} step={step} index={i} />
            ))
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
