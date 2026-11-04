"use client";

// ============================================================
// مخزن مسار / 42 — الاسم + التقدم (بدون قواعد بيانات)
// التقدم يعيش في localStorage، وينتقل بين الأجهزة بملف JSON
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DAYS, TOTAL_DAYS } from "./data";

export const PROGRESS_SCHEMA_VERSION = 1;

export type ProgressFile = {
  app: "path42";
  version: number;
  name: string;
  completedDays: number[];
  savedAt: string;
};

type GrowthState = {
  // بيانات المستخدم والتقدم
  name: string;
  completedDays: number[];
  setName: (name: string) => void;
  toggleDay: (dayId: number) => void;
  isDone: (dayId: number) => boolean;
  resetProgress: () => void;
  replaceFromFile: (file: ProgressFile) => void;
  mergeFromFile: (file: ProgressFile) => void;
  // حالة الواجهة
  activeWeek: number;
  openDayId: number | null;
  daySearch: string;
  completedOnly: boolean;
  setActiveWeek: (week: number) => void;
  openDay: (dayId: number) => void;
  setDaySearch: (q: string) => void;
  setCompletedOnly: (v: boolean) => void;
  clearFilters: () => void;
};

export const useGrowthStore = create<GrowthState>()(
  persist(
    (set, get) => ({
      name: "",
      completedDays: [],
      activeWeek: 1,
      openDayId: 1,
      daySearch: "",
      completedOnly: false,
      setActiveWeek: (week) =>
        set({ activeWeek: Math.min(6, Math.max(1, week)), openDayId: null }),
      openDay: (dayId) => set({ openDayId: dayId }),
      setDaySearch: (q) => set({ daySearch: q }),
      setCompletedOnly: (v) => set({ completedOnly: v }),
      clearFilters: () => set({ daySearch: "", completedOnly: false }),
      setName: (name) => set({ name: name.trim().slice(0, 40) }),
      toggleDay: (dayId) =>
        set((s) => ({
          completedDays: s.completedDays.includes(dayId)
            ? s.completedDays.filter((d) => d !== dayId)
            : [...s.completedDays, dayId].sort((a, b) => a - b),
        })),
      isDone: (dayId) => get().completedDays.includes(dayId),
      resetProgress: () => set({ completedDays: [] }),
      replaceFromFile: (file) =>
        set({
          name: (file.name || "").slice(0, 40),
          completedDays: sanitizeDays(file.completedDays),
        }),
      mergeFromFile: (file) =>
        set((s) => ({
          name: s.name || (file.name || "").slice(0, 40),
          completedDays: sanitizeDays(
            [...s.completedDays, ...sanitizeDays(file.completedDays)].sort(
              (a, b) => a - b
            )
          ),
        })),
    }),
    {
      name: "growth-ledger-progress",
      storage: createJSONStorage(() => localStorage),
      // يُحفظ فقط الاسم والتقدم — حالة الواجهة تبقى مؤقتة
      partialize: (s) => ({ name: s.name, completedDays: s.completedDays }),
    }
  )
);

function sanitizeDays(days: unknown): number[] {
  if (!Array.isArray(days)) return [];
  const valid = new Set(DAYS.map((d) => d.id));
  return [...new Set(days.filter((d): d is number => typeof d === "number" && valid.has(d)))].sort(
    (a, b) => a - b
  );
}

// ─────────── بناء ملف التصدير ───────────
export function buildProgressFile(name: string, completedDays: number[]): ProgressFile {
  return {
    app: "path42",
    version: PROGRESS_SCHEMA_VERSION,
    name,
    completedDays: sanitizeDays(completedDays),
    savedAt: new Date().toISOString(),
  };
}

// ─────────── التحقق من ملف مستورد ───────────
export type ParseResult =
  | { ok: true; file: ProgressFile }
  | { ok: false; error: string };

export function parseProgressFile(raw: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "الملف ليس JSON صالحًا." };
  }
  // توافق خلفي: صيغة الموقع الأصلية كانت مصفوفة أرقام أيام بسيطة [1, 3, 7]
  if (Array.isArray(data)) {
    const file: ProgressFile = {
      app: "path42",
      version: 1,
      name: "",
      completedDays: sanitizeDays(data),
      savedAt: new Date().toISOString(),
    };
    return { ok: true, file };
  }
  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "بنية الملف غير صحيحة." };
  }
  const obj = data as Record<string, unknown>;
  const hasDays = Array.isArray(obj.completedDays);
  if (obj.app !== "path42" && !hasDays) {
    return { ok: false, error: "هذا ليس ملف تقدم صادر من مسار / 42." };
  }
  if (hasDays) {
    const file: ProgressFile = {
      app: "path42",
      version: typeof obj.version === "number" ? obj.version : 1,
      name: typeof obj.name === "string" ? obj.name : "",
      completedDays: sanitizeDays(obj.completedDays),
      savedAt: typeof obj.savedAt === "string" ? obj.savedAt : new Date().toISOString(),
    };
    return { ok: true, file };
  }
  return { ok: false, error: "الملف لا يحتوي على قائمة تقدم صالحة." };
}

// ─────────── إحصائيات ───────────
export function progressPercent(completedDays: number[]): number {
  return Math.round((completedDays.length / TOTAL_DAYS) * 100);
}

// ─────────── تنزيل ملف ───────────
export function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─────────── اسم ملف التصدير ───────────
export function progressFileName(name: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const safe = (name || "path42").replace(/[^\p{L}\p{N}_-]+/gu, "-").slice(0, 30);
  return `path42-progress-${safe}-${date}.json`;
}
