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

export function QueryInput({
  onSubmit,
  loading,
  connected,
}: QueryInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "24px";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  };

  const handleInput = () => {
    adjustHeight();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
    setValue("");
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  };

  const selectSuggestion = (text: string) => {
    setValue(text);
    setShowSuggestions(false);
    setTimeout(() => {
      adjustHeight();
      textareaRef.current?.focus();
    }, 10);
  };

  return (
    <div className="relative border border-[#d0d7de] dark:border-[#30363d] rounded-xl bg-white dark:bg-[#0d1117] shadow-sm select-none transition-colors duration-200 w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] rounded-t-xl select-none">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] font-medium tracking-wide">
          db-copilot — zsh
        </span>
        <span className="w-4" />
      </div>

      <div className="p-4 flex flex-col gap-2 relative w-full">
        <div className="flex items-center gap-1 text-xs font-mono select-none">
          <span className="text-[#1a7f37] dark:text-[#58a6ff] font-bold">user@db</span>
          <span className="text-[#24292f] dark:text-[#c9d1d9]">:</span>
          <span className="text-[#0969da] dark:text-[#1f6feb] font-bold">~/query</span>
          <span className="text-[#24292f] dark:text-[#c9d1d9]">$</span>
        </div>

        <div className="flex items-end gap-3 w-full">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-[#24292f] dark:text-[#c9d1d9] placeholder-[#57606a] dark:placeholder-[#484f58] font-mono resize-none py-1 min-h-[24px] max-h-[150px] focus:outline-none focus:ring-0 leading-relaxed"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value.length > 0) setShowSuggestions(false);
            }}
            onInput={handleInput}
            onFocus={() => value.length === 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKey}
            placeholder="Type a natural language query or raw SQL..."
            rows={1}
            disabled={loading}
          />

          <button
            className={`shrink-0 h-8 px-4 flex items-center justify-center bg-[#1a7f37] hover:bg-[#1f883d] dark:bg-[#238636] dark:hover:bg-[#2ea043] disabled:opacity-40 disabled:hover:bg-[#1a7f37] dark:disabled:hover:bg-[#238636] text-white font-mono text-xs font-bold rounded border border-[rgba(31,35,40,0.15)] dark:border-[rgba(240,246,252,0.1)] transition-colors cursor-pointer select-none`}
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              "↵ RUN"
            )}
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute left-4 bottom-14 z-50 w-[280px] bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-1.5 text-[9px] font-bold text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider select-none border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 mb-1">
            Suggested Queries
          </div>
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-50 dark:hover:bg-[#21262d] font-mono truncate transition-colors cursor-pointer"
              onMouseDown={() => selectSuggestion(text)}
            >
              🚀 {text}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-1.5 bg-[#f6f8fa] dark:bg-[#161b22]/50 border-t border-[#d0d7de] dark:border-[#30363d] rounded-b-xl text-[10px] font-mono text-[#57606a] dark:text-[#8b949e] select-none">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[#27c93f]" : "bg-[#ff5f56]"}`} />
          <span>Gateway {connected ? "Connected" : "Disconnected"} on :8000</span>
        </div>
        <span className="opacity-70">Shift + ↵ for newline</span>
      </div>
    </div>
  );
}
