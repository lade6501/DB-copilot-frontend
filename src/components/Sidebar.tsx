import type { QuerySession } from "../types";

interface SidebarProps {
  history: QuerySession[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function Sidebar({ history, onSelect, onClear }: SidebarProps) {
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect
              x="2"
              y="2"
              width="18"
              height="18"
              rx="4"
              fill="currentColor"
              opacity="0.08"
            />
            <path
              d="M11 6v10M6 11h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="sidebar__brand">DB Copilot</span>
        </div>
        <span className="sidebar__version">v1.0</span>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-header">
          <span>Query History</span>
          {history.length > 0 && (
            <button className="sidebar__clear" onClick={onClear}>
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="sidebar__empty">No queries yet</div>
        ) : (
          <ul className="sidebar__list">
            {history.map((h) => (
              <li
                key={h.id}
                className="sidebar__item"
                onClick={() => onSelect(h.query)}
              >
                <div className="sidebar__item-top">
                  <span
                    className={`sidebar__item-dot ${h.success ? "sidebar__item-dot--ok" : "sidebar__item-dot--err"}`}
                  />
                  <span className="sidebar__item-query">{h.query}</span>
                </div>
                <div className="sidebar__item-meta">
                  <span>{formatTime(h.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__footer-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.5"
            />
            <path
              d="M7 6.5v3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <circle cx="7" cy="4.5" r="0.7" fill="currentColor" opacity="0.5" />
          </svg>
          <span>Docs</span>
        </div>
        <div className="sidebar__footer-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.5"
            />
            <path
              d="M4.5 7h5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}
