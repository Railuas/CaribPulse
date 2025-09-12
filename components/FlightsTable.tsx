type Row = {
  time?: string;
  estTime?: string;
  flight?: string;
  airline?: string;
  other?: string;
  status?: string;
};

export default function FlightsTable({ rows, title }: { rows: ReadonlyArray<Row>; title: string }) {
  return (
    <section className="card">
      <h4 style={{ marginTop: 0 }}>{title}</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ textAlign: 'left' }}>
            <tr>
              <th>Sched</th>
              <th>Est</th>
              <th>Flight</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <td>{r.time ?? '-'}</td>
                <td>{r.estTime ?? '-'}</td>
                <td>{r.flight ?? '-'}</td>
                <td>{r.airline ?? '-'}</td>
                <td>{r.other ?? '-'}</td>
                <td>{r.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
