import type { QueryResult } from "../../types";

interface Props {
  result: QueryResult;
}

export default function ReadResultTable({ result }: Props) {
  const columns = result.data.length > 0 ? Object.keys(result.data[0]) : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between p-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex-shrink-0 select-none">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-250">Query Results</h3>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 px-2 py-0.5 rounded-full select-none">
            {result.rows_returned} row{result.rows_returned !== 1 && "s"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span>Nothing was modified</span>
        </div>
      </div>

      {/* Table Area scrollable */}
      <div className="flex-1 overflow-auto">
        <table className="result-table w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 dark:bg-gray-850 z-10 border-b border-gray-200 dark:border-gray-800 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column} 
                  className="px-4 py-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide select-none"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
            {result.data.map((row, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50/40 dark:hover:bg-gray-800/10 transition-colors"
              >
                {columns.map((column) => {
                  const val = String(row[column] ?? "");
                  return (
                    <td 
                      key={column} 
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div 
                        className="max-w-[280px] truncate font-medium cursor-help" 
                        title={val}
                      >
                        {val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
