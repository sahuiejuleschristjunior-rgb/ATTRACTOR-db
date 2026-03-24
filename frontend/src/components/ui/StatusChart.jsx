const colors = {
  new: 'bg-sky-500',
  contacted: 'bg-amber-500',
  converted: 'bg-emerald-500'
};

export default function StatusChart({ data = [] }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Leads by status</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.status}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="capitalize text-slate-600">{item.status}</span>
              <span className="font-medium text-slate-900">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${colors[item.status] || 'bg-brand-500'}`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
