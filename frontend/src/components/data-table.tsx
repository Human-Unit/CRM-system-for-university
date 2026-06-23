export type ActivityRow = {
  actor: string;
  entity: string;
  action: string;
  time: string;
};

type DataTableProps = {
  rows: ActivityRow[];
};

export function DataTable({ rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-bg/80 text-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Actor</th>
            <th className="px-4 py-3 text-left font-semibold">Entity</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
            <th className="px-4 py-3 text-right font-semibold">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-panel">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-sm text-muted" colSpan={4}>
                No activity yet. Once the backend is connected, recent audit events will appear here.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={`${row.actor}-${row.entity}`} className="transition hover:bg-bg/50">
                <td className="px-4 py-3 font-medium">{row.actor}</td>
                <td className="px-4 py-3 text-muted">{row.entity}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-line bg-bg px-2.5 py-1 text-xs font-semibold tracking-wide">
                    {row.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-muted">{row.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
