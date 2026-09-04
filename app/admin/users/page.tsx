"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { Modal } from "../../../components/admin/Modal";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Icon } from "../../../components/icons";
import { getSupabaseAdminClient } from "../../../lib/supabaseAdmin";

type ParentRow = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  children: number;
  devices: number;
  joined: string;
};

const statusLabel: Record<string, string> = {
  active: "Aktiv",
  trial: "Sınaq",
  cancelled: "Dayandırılıb",
  expired: "Bitib",
};

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [viewing, setViewing] = useState<ParentRow | null>(null);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();

    async function load() {
      const [{ data: parentRows }, { data: childRows }, { data: subRows }, { data: planRows }, { data: codeRows }] =
        await Promise.all([
          supabase.from("parents").select("id, family_id, full_name, email, created_at"),
          supabase.from("children").select("family_id"),
          supabase.from("subscriptions").select("family_id, status, plan_id"),
          supabase.from("subscription_plans").select("id, name"),
          supabase.from("family_codes").select("family_id, bound_device_id").is("revoked_at", null),
        ]);

      const childrenByFamily = new Map<string, number>();
      (childRows ?? []).forEach((c) => {
        childrenByFamily.set(c.family_id, (childrenByFamily.get(c.family_id) ?? 0) + 1);
      });

      const planNameById = new Map((planRows ?? []).map((p) => [p.id, p.name]));
      const subByFamily = new Map<string, { status: string; planName: string }>();
      (subRows ?? []).forEach((s) => {
        subByFamily.set(s.family_id, { status: s.status, planName: planNameById.get(s.plan_id) ?? "—" });
      });

      const devicesByFamily = new Map<string, Set<string>>();
      (codeRows ?? []).forEach((c) => {
        if (!c.bound_device_id) return;
        const set = devicesByFamily.get(c.family_id) ?? new Set<string>();
        set.add(c.bound_device_id);
        devicesByFamily.set(c.family_id, set);
      });

      const rows: ParentRow[] = (parentRows ?? []).map((p) => {
        const sub = subByFamily.get(p.family_id);
        return {
          id: p.id,
          name: p.full_name || "—",
          email: p.email || "—",
          plan: sub?.planName ?? "Yoxdur",
          status: sub ? statusLabel[sub.status] ?? sub.status : "Yoxdur",
          children: childrenByFamily.get(p.family_id) ?? 0,
          devices: devicesByFamily.get(p.family_id)?.size ?? 0,
          joined: new Date(p.created_at).toLocaleDateString("az-AZ"),
        };
      });

      setParents(rows);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <AdminTopbar title="İstifadəçilər" subtitle="Real valideyn hesabları — parents cədvəlindən." />

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-inkMuted">
                  <th className="px-5 py-4 font-medium">Valideyn</th>
                  <th className="px-5 py-4 font-medium">Plan</th>
                  <th className="px-5 py-4 font-medium">Uşaqlar</th>
                  <th className="px-5 py-4 font-medium">Cihazlar</th>
                  <th className="px-5 py-4 font-medium">Qeydiyyat</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-inkMuted">
                      Yüklənir...
                    </td>
                  </tr>
                ) : parents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-inkMuted">
                      Heç bir istifadəçi tapılmadı.
                    </td>
                  </tr>
                ) : (
                  parents.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-inkMuted">{p.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                          {p.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-ink">{p.children}</td>
                      <td className="px-5 py-4 text-ink">{p.devices}</td>
                      <td className="px-5 py-4 text-inkMuted">{p.joined}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={p.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button aria-label="Bax" onClick={() => setViewing(p)} className="text-inkMuted hover:text-primary">
                          <Icon name="eye" style={{ width: 18, height: 18 }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal title="Valideyn məlumatı" open={!!viewing} onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-inkMuted">Ad</span>
              <span className="font-medium text-ink">{viewing.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">E-poçt</span>
              <span className="font-medium text-ink">{viewing.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Plan</span>
              <span className="font-medium text-ink">{viewing.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Uşaqlar</span>
              <span className="font-medium text-ink">{viewing.children}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Cihazlar</span>
              <span className="font-medium text-ink">{viewing.devices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Qeydiyyat tarixi</span>
              <span className="font-medium text-ink">{viewing.joined}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-inkMuted">Status</span>
              <StatusBadge label={viewing.status} />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
