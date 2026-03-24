export default function RecentActivity({ items = [] }) {
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Recent activity</h3>
      <div className="space-y-4">
        {items.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
        {items.map((item, idx) => (
          <div key={`${item.title}-${idx}`} className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-brand-500" />
            <div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
