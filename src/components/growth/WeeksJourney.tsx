"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  FileText,
  Globe,
  GraduationCap,
  Link2,
  Megaphone,
  PenLine,
  Search,
  Target,
} from "lucide-react";
import { WEEKS } from "@/lib/growth/data";
import { useGrowthStore } from "@/lib/growth/store";
import { useRouter } from "next/navigation";

const WEEK_ICONS = [Globe, Target, PenLine, Search, Megaphone, GraduationCap];

export function WeeksJourney() {
  const activeWeek = useGrowthStore((s) => s.activeWeek);
  const setActiveWeek = useGrowthStore((s) => s.setActiveWeek);
  const completedDays = useGrowthStore((s) => s.completedDays);
  const week = WEEKS.find((w) => w.id === activeWeek) ?? WEEKS[0];

  return (
    <section id="journey" className="scroll-mt-24 bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ترويسة القسم */}
        <div className="max-w-2xl">
          <p className="font-label text-xs font-medium text-flame-deep">
            01 / خريطة الرحلة
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-snug text-ink sm:text-4xl lg:text-[2.6rem]">
            ستة أسابيع، وكل أسبوع يترك أثرًا.
          </h2>
          <p className="mt-4 leading-8 text-ink/70">
            لا تتحرك الخطة من فيديو إلى فيديو. كل أسبوع يضيف قطعة محددة إلى مشروع
            CodeSpark AI، حتى تتحول ملاحظاتك في نهاية الأسبوع السادس إلى دراسة
            حالة يمكنك عرضها ومناقشة قراراتها.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          {/* بطاقة الأسبوع النشط */}
          <article className="relative rounded-xl border border-ink/12 bg-paper p-6 shadow-cut-blush sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink font-heading text-lg font-bold text-ink" dir="ltr">
                {String(week.id).padStart(2, "0")}
              </span>
              <div className="text-left">
                <p className="font-label text-xs font-medium text-flame-deep" dir="ltr">
                  Week {String(week.id).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">
                  {week.title}
                </h3>
              </div>
            </div>
            <p className="mt-4 leading-8 text-ink/70">{week.description}</p>

            <div className="mt-6 border-t border-dashed border-ink/20 pt-5">
              <p className="font-label text-[10px] font-medium text-flame-deep">
                مخرج نهاية الأسبوع
              </p>
              <p className="mt-2 flex items-center gap-2 font-heading text-lg font-bold text-ink">
                <FileText className="h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
                {week.deliverable}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <a
                href="#today"
                onClick={() => setActiveWeek(week.id)}
                className="group inline-flex items-center gap-2 font-heading text-sm font-semibold text-flame-deep hover:text-flame"
              >
                افتح أيام الأسبوع
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </a>
              <Link
                href={`/week/${week.id}`}
                className="inline-flex items-center gap-2 text-sm text-ink/75 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-flame"
              >
                <Link2 className="h-4 w-4" aria-hidden="true" />
                رابط قابل للمشاركة
              </Link>
            </div>
          </article>

          {/* خريطة الطريق التفاعلية */}
          <RoadmapPanel active={week.id} onSelect={setActiveWeek} completedDays={completedDays} />
        </div>
      </div>
    </section>
  );
}

function RoadmapPanel({
  active,
  onSelect,
  completedDays,
}: {
  active: number;
  onSelect: (w: number) => void;
  completedDays: number[];
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink/12 bg-sage/60 shadow-cut-sage">
      {/* خلفية الطريق */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 500 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M60 40 C 260 60, 420 120, 380 190 C 340 260, 120 270, 110 340 C 100 410, 360 420, 400 480 C 440 540, 180 560, 140 620 C 120 650, 160 680, 220 690"
          fill="none"
          stroke="#fdfaf2"
          strokeWidth="26"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M60 40 C 260 60, 420 120, 380 190 C 340 260, 120 270, 110 340 C 100 410, 360 420, 400 480 C 440 540, 180 560, 140 620 C 120 650, 160 680, 220 690"
          fill="none"
          stroke="#9fb089"
          strokeWidth="2.5"
          strokeDasharray="10 12"
          strokeLinecap="round"
        />
      </svg>

      {/* محطات الأسابيع */}
      <ol className="relative flex flex-col gap-1 p-5 sm:p-7" role="tablist" aria-label="اختر أسبوعًا">
        {WEEKS.map((w, i) => {
          const Icon = WEEK_ICONS[i];
          const isActive = w.id === active;
          const weekDays = Array.from({ length: 7 }, (_, d) => (w.id - 1) * 7 + d + 1);
          const weekDone = weekDays.every((d) => completedDays.includes(d));
          return (
            <li key={w.id} className={i % 2 === 0 ? "self-start" : "self-end"}>
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(w.id)}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all sm:gap-4 sm:px-4 ${
                  isActive
                    ? "border-flame bg-paper shadow-cut-flame"
                    : "border-transparent hover:border-ink/15 hover:bg-paper/80"
                }`}
              >
                <span className="flex items-center gap-2" dir="ltr">
                  <span
                    className={`font-label text-[11px] font-medium ${
                      isActive ? "text-flame-deep" : "text-ink/70"
                    }`}
                  >
                    {String(w.id).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? "bg-flame text-paper"
                        : weekDone
                          ? "bg-sage-deep text-paper"
                          : "bg-ink text-paper"
                    }`}
                  >
                    {weekDone && !isActive ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </span>
                <span
                  className={`font-heading text-sm font-bold sm:text-base ${
                    isActive ? "text-flame-deep" : "text-ink"
                  }`}
                >
                  {w.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
