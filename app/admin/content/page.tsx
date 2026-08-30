"use client";

import { useState } from "react";
import { AdminTopbar } from "../../../components/admin/AdminTopbar";
import { Modal } from "../../../components/admin/Modal";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import {
  lessons as initialLessons,
  questions as initialQuestions,
  worldItems as initialWorldItems,
  type Lesson,
  type Question,
  type WorldItem,
} from "../../../lib/adminMock";

const tabs = ["Suallar", "Dərslər", "Dünya elementləri"] as const;

export default function AdminContent() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Suallar");
  const [open, setOpen] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [qPrompt, setQPrompt] = useState("");
  const [qCategory, setQCategory] = useState("");
  const [qAge, setQAge] = useState("5-7");
  const [qDifficulty, setQDifficulty] = useState<Question["difficulty"]>("Asan");

  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [lTitle, setLTitle] = useState("");
  const [lAge, setLAge] = useState("5-7");
  const [lFormat, setLFormat] = useState("Mətn + Şəkil");

  const [worldItems, setWorldItems] = useState<WorldItem[]>(initialWorldItems);
  const [wName, setWName] = useState("");
  const [wType, setWType] = useState<WorldItem["type"]>("Bina");
  const [wLevel, setWLevel] = useState("10");

  function submit() {
    if (tab === "Suallar") {
      if (!qPrompt.trim() || !qCategory.trim()) return;
      setQuestions((list) => [
        { id: `${Date.now()}`, prompt: qPrompt, category: qCategory, age: qAge, difficulty: qDifficulty, status: "Qaralama" },
        ...list,
      ]);
      setQPrompt("");
      setQCategory("");
    } else if (tab === "Dərslər") {
      if (!lTitle.trim()) return;
      setLessons((list) => [
        { id: `${Date.now()}`, title: lTitle, age: lAge, format: lFormat, status: "Qaralama" },
        ...list,
      ]);
      setLTitle("");
    } else {
      if (!wName.trim()) return;
      setWorldItems((list) => [
        { id: `${Date.now()}`, name: wName, type: wType, unlockLevel: Number(wLevel) || 1 },
        ...list,
      ]);
      setWName("");
    }
    setOpen(false);
  }

  return (
    <>
      <AdminTopbar
        title="Məzmun idarəsi"
        subtitle="Sualları, dərsləri və dünya elementlərini idarə edin."
        action={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primaryDark"
          >
            + Yeni yarat
          </button>
        }
      />

      <div className="px-8 pb-10">
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

        {tab === "Suallar" ? (
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-inkMuted">
                    <th className="px-5 py-4 font-medium">Sual</th>
                    <th className="px-5 py-4 font-medium">Kateqoriya</th>
                    <th className="px-5 py-4 font-medium">Yaş</th>
                    <th className="px-5 py-4 font-medium">Çətinlik</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">{q.prompt}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.category}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.age}</td>
                      <td className="px-5 py-4 text-inkMuted">{q.difficulty}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "Dərslər" ? (
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-inkMuted">
                    <th className="px-5 py-4 font-medium">Başlıq</th>
                    <th className="px-5 py-4 font-medium">Yaş</th>
                    <th className="px-5 py-4 font-medium">Format</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l) => (
                    <tr key={l.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">{l.title}</td>
                      <td className="px-5 py-4 text-inkMuted">{l.age}</td>
                      <td className="px-5 py-4 text-inkMuted">{l.format}</td>
                      <td className="px-5 py-4">
                        <StatusBadge label={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "Dünya elementləri" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {worldItems.map((w) => (
              <div key={w.id} className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
                <p className="text-xs font-medium text-inkMuted">{w.type}</p>
                <p className="mt-1 font-bold text-ink">{w.name}</p>
                <p className="mt-2 text-xs text-inkMuted">🔒 Səviyyə {w.unlockLevel}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Modal
        title={
          tab === "Suallar" ? "Yeni sual yarat" : tab === "Dərslər" ? "Yeni dərs yarat" : "Yeni dünya elementi"
        }
        open={open}
        onClose={() => setOpen(false)}
      >
        {tab === "Suallar" ? (
          <>
            <label className="mb-1 block text-xs font-medium text-inkMuted">Sual</label>
            <input
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              placeholder="Which one is a mosque?"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <label className="mb-1 block text-xs font-medium text-inkMuted">Kateqoriya</label>
            <input
              value={qCategory}
              onChange={(e) => setQCategory(e.target.value)}
              placeholder="Islam Basics"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Yaş</label>
                <select
                  value={qAge}
                  onChange={(e) => setQAge(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  {["3-4", "5-7", "8-10", "11-13", "14-16"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Çətinlik</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as Question["difficulty"])}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option>Asan</option>
                  <option>Orta</option>
                  <option>Çətin</option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        {tab === "Dərslər" ? (
          <>
            <label className="mb-1 block text-xs font-medium text-inkMuted">Başlıq</label>
            <input
              value={lTitle}
              onChange={(e) => setLTitle(e.target.value)}
              placeholder="The Five Pillars of Islam"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Yaş</label>
                <select
                  value={lAge}
                  onChange={(e) => setLAge(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  {["3-4", "5-7", "8-10", "11-13", "14-16"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Format</label>
                <select
                  value={lFormat}
                  onChange={(e) => setLFormat(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option>Mətn + Şəkil</option>
                  <option>Mətn + Video</option>
                  <option>Mətn + Audio</option>
                  <option>Video</option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        {tab === "Dünya elementləri" ? (
          <>
            <label className="mb-1 block text-xs font-medium text-inkMuted">Ad</label>
            <input
              value={wName}
              onChange={(e) => setWName(e.target.value)}
              placeholder="Golden Mosque"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Növ</label>
                <select
                  value={wType}
                  onChange={(e) => setWType(e.target.value as WorldItem["type"])}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option>Bina</option>
                  <option>Geyim</option>
                  <option>Bəzək</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-inkMuted">Unlock səviyyəsi</label>
                <input
                  value={wLevel}
                  onChange={(e) => setWLevel(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            İmtina
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primaryDark"
          >
            Yarat
          </button>
        </div>
      </Modal>
    </>
  );
}
