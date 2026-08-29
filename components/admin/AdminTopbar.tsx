export function AdminTopbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-inkMuted">
          🔍 <span>Axtarış...</span>
        </div>

        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 text-sm font-medium text-ink">
            🌐 AZ <span className="text-inkMuted">▾</span>
          </button>
          <div className="relative text-lg">
            🔔
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              12
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-lg">
              🧑
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-ink">Admin</p>
              <p className="text-xs text-inkMuted">Super Admin</p>
            </div>
            <span className="text-inkMuted">▾</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-inkMuted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}
