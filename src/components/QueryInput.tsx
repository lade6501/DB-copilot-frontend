import { useState, useRef, type KeyboardEvent } from "react";

const SUGGESTIONS = [
  "Get all users",
  "Show top 10 orders by amount",
  "Count active users by country",
  "Find products with low stock",
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
    if (!trimmed || loading) return;

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    setValue("");
    setShowSuggestions(false);

    requestAnimationFrame(() => {
      onSubmit(trimmed);
    });
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setValue("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.value = "";

    requestAnimationFrame(() => {
      onSubmit(s);
    });
  };

  return (
    <div className="terminal-input-wrap">
      <div className="terminal-input-header">
        <div className="terminal-window-controls">
          <span className="tw-dot tw-dot--close" />
          <span className="tw-dot tw-dot--minimize" />
          <span className="tw-dot tw-dot--expand" />
        </div>
        <span className="terminal-input-title">db-copilot — zsh</span>
      </div>

      <div className="terminal-input-body">
        <div className="terminal-prompt">
          <span className="prompt-user">user@db</span>
          <span className="prompt-colon">:</span>
          <span className="prompt-path">~/query</span>
          <span className="prompt-char">$</span>
        </div>

        <div className="terminal-textarea-wrapper">
          <textarea
            ref={textareaRef}
            className="terminal-textarea"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value.length > 0) setShowSuggestions(false);
            }}
            onFocus={() => value.length === 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKey}
            placeholder="Type a natural language query or raw SQL..."
            rows={1}
            disabled={loading}
          />
          <button
            className={`terminal-run-btn ${loading ? "terminal-run-btn--loading" : ""}`}
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
          >
            {loading ? <span className="spinner spinner--sm" /> : "↵ RUN"}
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div className="terminal-suggestions">
          <span className="terminal-suggestions-label">History:</span>
          <div className="terminal-suggestions-list">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="terminal-suggestion-chip"
                onMouseDown={() => handleSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="terminal-input-footer">
        <div className="terminal-status">
          <span
            className={`status-dot ${connected ? "status-dot--on" : "status-dot--off"}`}
          />
          <span>
            {connected ? "Gateway Connected on :8000" : "Connection Refused"}
          </span>
        </div>
        <span className="terminal-hint">Shift + ↵ for newline</span>
      </div>
    </div>
  );
}
