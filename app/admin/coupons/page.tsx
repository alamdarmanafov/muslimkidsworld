"use client";

import { useMemo, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { IconBadge } from "../../../components/IconBadge";
import { coupons as initialCoupons, couponSummary, type Coupon } from "../../../lib/adminMock";

const tabs = ["Bütün kuponlar", "Əyləncə yerləri", "Yemək yerləri", "Kampaniyalar"] as const;

function generateCode() {
  return "MKW" + Math.floor(1000 + Math.random() * 9000);
}

export default function AdminCoupons() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Bütün kuponlar");
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons);
  const [couponType, setCouponType] = useState<"Əyləncə yeri" | "Yemək yeri">("Əyləncə yeri");
  const [couponCode, setCouponCode] = useState("");
  const [discountValue, setDiscountValue] = useState("20");
  const [maxDiscount, setMaxDiscount] = useState("10");

  const filtered = useMemo(() => {
    if (tab === "Əyləncə yerləri") return couponList.filter((c) => c.category === "Əyləncə");
    if (tab === "Yemək yerləri") return couponList.filter((c) => c.category === "Yemək");
    return couponList;
  }, [tab, couponList]);

  function toggleActive(id: string) {
    setCouponList((list) =>
      list.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  return (
    <>
      <AdminTopbar
        title="Kuponlar"
        subtitle="Uşaqlar üçün əyləncə və yemək yerlərində endirim kuponları yaradın və idarə edin."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md">
            + Yeni kupon yarat
          </button>
        }
      />

      <div className="px-8 pb-12">
        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-border text-sm font-medium text-inkMuted">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 transition ${
                tab === t ? "border-primary text-primary" : "border-transparent hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {couponSummary.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <IconBadge icon={s.icon} tone={s.tone} size={44} />
              <div>
                <p className="text-xl font-extrabold text-ink">{s.value}</p>
                <p className="text-xs text-inkMuted">{s.label}</p>
                <p className="text-xs font-medium text-green-600">{s.delta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Coupon table */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Kupon siyahısı</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-inkMuted">
                    <th className="pb-3 font-medium">Kupon</th>
                    <th className="pb-3 font-medium">Kateqoriya</th>
                    <th className="pb-3 font-medium">Endirim</th>
                    <th className="pb-3 font-medium">Paylanılıb</th>
                    <th className="pb-3 font-medium">İstifadə edilib</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${c.logoColor}`}
                          >
                            {c.logo}
                          </span>
                          <div>
                            <p className="font-semibold text-ink">{c.code}</p>
                            <p className="text-xs text-inkMuted">{c.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            c.category === "Əyləncə"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {c.category}
                        </span>
                      </td>
                      <td>
                        <p className="font-semibold text-ink">{c.discount}</p>
                        <p className="text-xs text-inkMuted">{c.maxDiscount}</p>
                      </td>
                      <td>
                        <p className="text-ink">{c.distributedDelta}</p>
                        <p className="text-xs text-inkMuted">{c.expires}-dək etibarlı</p>
                      </td>
                      <td>
                        <p className="text-ink">{c.used}</p>
                        <p className="text-xs text-inkMuted">{c.usedPercent}%</p>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleActive(c.id)}
                          className={`h-6 w-11 rounded-full p-0.5 transition ${
                            c.active ? "bg-green-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 rounded-full bg-white transition ${
                              c.active ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              {[1, 2, 3, 4, "…", 12].map((p, i) => (
                <button
                  key={i}
                  className={`h-8 w-8 rounded-lg ${
                    p === 1 ? "bg-primary text-white" : "text-inkMuted hover:bg-surface"
                  }`}
                  disabled={p === "…"}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Create coupon form */}
          <div className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Yeni kupon yarat</h2>

            <label className="mb-1 block text-xs font-medium text-inkMuted">Kupon növü</label>
            <div className="mb-4 flex gap-4 text-sm">
              {(["Əyləncə yeri", "Yemək yeri"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={couponType === t}
                    onChange={() => setCouponType(t)}
                  />
                  {t}
                </label>
              ))}
            </div>

            <label className="mb-1 block text-xs font-medium text-inkMuted">Tərəfdaş</label>
            <select className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option>Tərəfdaş seçin</option>
              <option>Joyland Əyləncə Mərkəzi</option>
              <option>Fun Zone Park</option>
              <option>McDonald&apos;s Azərbaycan</option>
            </select>

            <label className="mb-1 block text-xs font-medium text-inkMuted">Kupon kodu</label>
            <div className="mb-4 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Uşaqlar üçün unikal kod"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <button
                onClick={() => setCouponCode(generateCode())}
                className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
              >
                Kod yarat
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Endirim növü</label>
                <select className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                  <option>Faizlə (%)</option>
                  <option>Sabit məbləğ</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Endirim dəyəri</label>
                <input
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-inkMuted">
              Maksimum endirim (AZN)
            </label>
            <input
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-medium text-inkMuted">
              Etibarlılıq müddəti
            </label>
            <div className="mb-4 flex items-center gap-2">
              <input type="date" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              <span className="text-inkMuted">→</span>
              <input type="date" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            </div>

            <label className="mb-1 block text-xs font-medium text-inkMuted">
              Tətbiq olunduğu istifadəçi qrupu
            </label>
            <select className="mb-6 w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option>Uşaqlar (3–18 yaş)</option>
              <option>Bütün istifadəçilər</option>
              <option>Premium abunəçilər</option>
            </select>

            <div className="flex gap-3">
              <button className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-ink">
                İmtina
              </button>
              <button className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white">
                Yarat
              </button>
            </div>
          </div>
        </div>

        {/* Popular coupons */}
        <h2 className="mb-4 mt-10 text-lg font-bold text-ink">Populyar kuponlar</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {couponList.slice(0, 4).map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl p-5 text-white shadow-md ${
                c.category === "Əyləncə" ? "bg-gradient-to-br from-orange-400 to-amber-500" : "bg-gradient-to-br from-red-500 to-rose-600"
              }`}
            >
              <p className="text-2xl font-extrabold">{c.discount} ENDİRİM</p>
              <p className="mt-1 text-sm font-medium">{c.name}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full bg-white/20 px-3 py-1 font-semibold">
                  Kod: {c.code}
                </span>
                <span>{c.expires}-dək etibarlı</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
