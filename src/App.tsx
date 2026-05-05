import { useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { useQueryHistory } from "./hooks/useQueryHistory";
import { QueryInput } from "./components/QueryInput";
import { StepCard } from "./components/StepCard";
import { ResultTable } from "./components/ResultTable";
import { Sidebar } from "./components/Sidebar";
import "./App.css";

export default function App() {
  const { steps, loading, connected, error, sendQuery, reset } = useWebSocket();
  const { history, addHistory, clearHistory } = useQueryHistory();

  const executeStep = steps.find((s) => s.step === "execute" && s.result);
  const result = executeStep?.result;
  const executionTime = executeStep?.execution_time;

  useEffect(() => {
    if (!loading && steps.length > 0) {
      const lastQuery =
        (steps.find((s) => s.step === "interpret")?.data?.query as string) ??
        "";
      const success = !steps.some((s) => s.status === "error");
      addHistory(lastQuery, success, result?.length);
    }
  }, [loading, steps]);

  const handleQuery = (q: string) => {
    reset();
    sendQuery(q);
  };

  const activeSteps = steps.filter((s) => s.step !== "done");
  const hasResult = !!result;

  return (
    <div className="app">
      <Sidebar
        history={history}
        onSelect={handleQuery}
        onClear={clearHistory}
      />

      <main className="main">
        <div className="main__top">
          <div className="main__heading">
            <h1 className="main__title">Query your database</h1>
            <p className="main__sub">
              Natural language → SQL, live execution steps
            </p>
          </div>
        </div>

        <QueryInput
          onSubmit={handleQuery}
          loading={loading}
          connected={connected}
        />

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M8 5v3.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <circle cx="8" cy="11" r="0.7" fill="currentColor" />
            </svg>
            {error}
          </div>
        )}

        {activeSteps.length > 0 && (
          <section className="steps-section">
            <div className="steps-header">
              <span className="steps-title">Execution Pipeline</span>
              {loading && (
                <span className="steps-running">
                  <span className="steps-running__dot" />
                  Running
                </span>
              )}
            </div>
            <div className="steps-list">
              {activeSteps.map((step, i) => (
                <StepCard key={step.step} step={step} index={i} />
              ))}
            </div>
          </section>
        )}

        {hasResult && (
          <section className="result-section">
            <div className="result-section__header">
              <span className="result-section__title">Results</span>
            </div>
            <ResultTable result={result!} executionTime={executionTime} />
          </section>
        )}

        {activeSteps.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect
                  x="4"
                  y="4"
                  width="32"
                  height="32"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.25"
                />
                <path
                  d="M14 20h12M20 14v12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <p className="empty-state__text">
              Run a query to see live execution steps
            </p>
            <div className="empty-state__chips">
              {["Get all users", "Top 10 orders", "Count by country"].map(
                (s) => (
                  <button
                    key={s}
                    className="empty-chip"
                    onClick={() => handleQuery(s)}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
