import type { QueryResult } from "../types";

interface Props {
  result: QueryResult;
}

export default function ReadResultTable({ result }: Props) {
  const columns = result.data.length > 0 ? Object.keys(result.data[0]) : [];

  return (
    <>
      <div className="result-panel__header">
        <div>
          <h3>Query Results</h3>

          <span className="badge">
            {result.rows_returned} row
            {result.rows_returned !== 1 && "s"}
          </span>
        </div>
      </div>

      <div className="result-table-wrapper">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((column) => (
                  <td key={column}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
