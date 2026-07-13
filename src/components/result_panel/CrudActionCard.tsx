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
    <div className="crud-card">
      <div className="crud-card__icon">{getIcon()}</div>

      <h2>{getTitle()}</h2>

      <p className="crud-card__message">{result.message}</p>

      <div className="crud-card__stats">
        <div className="stat-card">
          <span>Entity</span>
          <strong>{result.entity}</strong>
        </div>

        <div className="stat-card">
          <span>Rows Affected</span>
          <strong>{result.rows_affected}</strong>
        </div>

        <div className="stat-card">
          <span>Execution Time</span>
          <strong>{result.execution_time}s</strong>
        </div>
      </div>

      {result.affected_ids.length > 0 && (
        <>
          <h4>Affected IDs</h4>

          <div className="affected-ids">
            {result.affected_ids.map((id) => (
              <span key={id} className="id-pill">
                {id}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="query-preview">
        <h4>Executed Query</h4>

        <pre>{result.executed_query}</pre>
      </div>
    </div>
  );
}
