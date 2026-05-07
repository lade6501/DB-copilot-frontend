import { useState, useRef, type KeyboardEvent } from "react";

const SUGGESTIONS = [
  "Get all users",
  "Show top 10 orders by amount",
  "Count active users by country",
  "Find products with low stock",
  "List recent signups from last 7 days",
];

interface QueryInputProps {
  onSubmit: (query: string) => void;
  loading: boolean;
  connected: boolean;
}

export function QueryInput({ onSubmit, loading, connected }: QueryInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    console.log("handleSubmit", { trimmed, loading });
    if (!trimmed || loading) return;
    console.log("submitting", trimmed);
    onSubmit(trimmed);
    setShowSuggestions(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setValue(s);
    setShowSuggestions(false);
    textareaRef.current?.focus();
    onSubmit(s);
  };

  return (
    <div className="query-input-wrap">
      <div className={`query-box ${loading ? "query-box--loading" : ""}`}>
        <div className="query-box__inner">
          <span className="query-box__prompt">&gt;_</span>
          <textarea
            ref={textareaRef}
            className="query-box__textarea"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value.length > 0) setShowSuggestions(false);
            }}
            onFocus={() => value.length === 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your database..."
            rows={1}
            disabled={loading}
          />
        </div>
        <button
          className={`query-btn ${loading ? "query-btn--loading" : ""}`}
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
        >
          {loading ? (
            <span className="query-btn__spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>{loading ? "Running" : "Run"}</span>
        </button>
      </div>

      {showSuggestions && (
        <div className="suggestions">
          <span className="suggestions__label">Try asking</span>
          <div className="suggestions__list">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onMouseDown={() => handleSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="query-status">
        <span
          className={`status-dot ${connected ? "status-dot--on" : "status-dot--off"}`}
        />
        <span className="status-label">
          {connected ? "Connected" : "Disconnected"} · ws://localhost:8000
        </span>
        <span className="status-hint">⏎ to run · Shift+⏎ for newline</span>
      </div>
    </div>
  );
}
