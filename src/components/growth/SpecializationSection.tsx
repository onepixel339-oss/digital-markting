"use client";

import { Flag } from "lucide-react";
import { SPECIALIZATIONS } from "@/lib/growth/data";

export function SpecializationSection() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="torn-both relative bg-sage/70 p-8 sm:p-12">
          <p className="font-label text-xs font-medium text-flame-deep">
            05 / الخطوة التالية
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold leading-snug text-ink sm:text-4xl">
            اختر تخصصًا واحدًا بعد الأساس.
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-ink/75">
            بعد Day 42 قيّم متعتك وجودة مخرجاتك وسرعة تعلمك وميلك التقني. ابدأ
            بعدها بـHubSpot، ثم أدخل Semrush أو Google Skillshop أو Meta
            Blueprint حسب المسار الذي تثبته نتائجك.
          </p>

          <ul className="mt-8 grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {SPECIALIZATIONS.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between gap-4 border-b border-ink/15 py-3.5"
              >
                <span className="flex items-center gap-3">
                  <Flag className="h-4 w-4 shrink-0 text-flame-deep" aria-hidden="true" />
                  <span className="font-heading text-base font-bold text-ink" dir="auto">
                    {s.name}
                  </span>
                </span>
                <span className="text-sm text-ink/75">{s.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
