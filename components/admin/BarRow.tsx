export function BarRow({ label, value, suffix = "%" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-inkMuted">{label}</span>
        <span className="font-semibold text-ink">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
