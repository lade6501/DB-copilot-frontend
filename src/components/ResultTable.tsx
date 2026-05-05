interface ResultTableProps {
  result: Record<string, unknown>[];
  executionTime?: number;
}

export function ResultTable({ result, executionTime }: ResultTableProps) {
  if (!result || result.length === 0) {
    return (
      <div className="result-empty">
        <span className="result-empty__icon">○</span>
        <span>Query returned 0 rows</span>
      </div>
    );
  }

  const columns = Object.keys(result[0]);

  return (
    <div className="result-wrap">
      <div className="result-meta">
        <span className="result-badge">
          {result.length} {result.length === 1 ? "row" : "rows"}
        </span>
        {executionTime !== undefined && (
          <span className="result-time">
            ⚡ {(executionTime * 1000).toFixed(2)}ms
          </span>
        )}
      </div>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>
                    {row[col] === null ? (
                      <span className="null-val">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
