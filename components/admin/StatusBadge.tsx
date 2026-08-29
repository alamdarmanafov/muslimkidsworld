const toneClasses = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-slate-100 text-slate-600",
} as const;

const statusTone: Record<string, keyof typeof toneClasses> = {
  Aktiv: "green",
  Yayımlanıb: "green",
  Göndərilib: "green",
  "Cavablandırılıb": "blue",
  Planlaşdırılıb: "blue",
  "Sınaq müddəti": "blue",
  Sınaq: "blue",
  "Sınaq: ": "blue",
  Baxılır: "amber",
  "Gözləmədə": "amber",
  Açıq: "amber",
  Qaralama: "gray",
  Bitib: "gray",
  Bağlanıb: "gray",
  "Dayandırılıb": "red",
  "Ləğv edilib": "red",
  "Yüksək": "red",
  "Orta": "amber",
  "Aşağı": "gray",
};

export function StatusBadge({ label }: { label: string }) {
  const tone = statusTone[label] ?? "gray";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
