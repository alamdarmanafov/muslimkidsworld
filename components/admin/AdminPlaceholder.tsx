import { AdminTopbar } from "./AdminTopbar";

export function AdminPlaceholder({
  title,
  subtitle,
  emoji,
  note,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  note: string;
}) {
  return (
    <>
      <AdminTopbar title={title} subtitle={subtitle} />
      <div className="mx-8 mb-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-24 text-center">
        <span className="text-5xl">{emoji}</span>
        <p className="mt-4 text-sm text-inkMuted">{note}</p>
      </div>
    </>
  );
}
