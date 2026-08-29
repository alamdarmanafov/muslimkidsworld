export function ProgressCell({ percent }: { percent: number }) {
  const color = percent >= 85 ? "bg-green-500" : percent >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs font-medium text-ink">{percent}%</span>
    </div>
  );
}
