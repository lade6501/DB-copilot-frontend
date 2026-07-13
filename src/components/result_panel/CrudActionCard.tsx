import type { QueryResult } from "../../types";

interface Props {
  result: QueryResult;
}

export default function CrudActionCard({ result }: Props) {
  const getIcon = () => {
    switch (result.action) {
      case "write":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      default:
        return "✅";
    }
  };

  const getTitle = () => {
    switch (result.action) {
      case "write":
        return "Insert Successful";
      case "update":
        return "Update Successful";
      case "delete":
        return "Delete Successful";
      default:
        return "Operation Successful";
    }
  };

  return (
    <div className="p-6 max-w-2xl w-full mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.015)] my-6 select-none animate-in fade-in slide-in-from-bottom-2 duration-155">
      <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl mb-4">
        {getIcon()}
      </div>

      <h2 className="text-lg font-bold text-gray-850 dark:text-gray-100 mb-1">
        {getTitle()}
      </h2>

      <p className="text-xs text-gray-450 dark:text-gray-500 mb-6 font-medium">
        {result.message}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-800/60 p-4 rounded-xl flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-505 uppercase tracking-wide mb-1">
            Entity
          </span>
          <strong className="text-sm font-bold text-gray-750 dark:text-gray-200 truncate" title={result.entity}>
            {result.entity}
          </strong>
        </div>

        <div className="bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-800/60 p-4 rounded-xl flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-505 uppercase tracking-wide mb-1">
            Rows Affected
          </span>
          <strong className="text-sm font-bold text-gray-755 dark:text-gray-200">
            {result.rows_affected}
          </strong>
        </div>

        <div className="bg-slate-50 dark:bg-gray-800/30 border border-gray-150 dark:border-gray-800/60 p-4 rounded-xl flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-505 uppercase tracking-wide mb-1">
            Execution Time
          </span>
          <strong className="text-sm font-bold text-gray-755 dark:text-gray-200">
            {result.execution_time}s
          </strong>
        </div>
      </div>

      {result.affected_ids.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-450 dark:text-gray-550 uppercase tracking-wider mb-2">
            Affected IDs
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.affected_ids.map((id) => (
              <span 
                key={id} 
                className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/20 px-3.5 py-0.5 rounded-full text-xs font-semibold select-text"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-xs font-bold text-gray-450 dark:text-gray-555 uppercase tracking-wider mb-2">
          Executed Query
        </h4>
        <pre className="border border-gray-200 dark:border-gray-800 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs p-4 leading-relaxed overflow-x-auto whitespace-pre block select-text scrollbar-thin max-w-full">
          <code>{result.executed_query}</code>
        </pre>
      </div>
    </div>
  );
}
