"use client";

import Image from "next/image";
import { ArrowLeft, Play } from "lucide-react";
import { DAYS, TOTAL_DAYS } from "@/lib/growth/data";
import { useGrowthStore } from "@/lib/growth/store";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-20 lg:pt-14">
        {/* النص */}
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-1.5 text-xs font-medium text-ink/80 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-flame" aria-hidden="true" />
            6 أسابيع · 42 يوماً · مخرج يومي واحد
          </span>

          <p className="font-label mt-6 text-xs font-medium text-flame-deep" dir="ltr">
            Learn <span aria-hidden="true">→</span> Apply <span aria-hidden="true">→</span> Produce{" "}
            <span aria-hidden="true">→</span> Review
          </p>

          <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.25] text-ink sm:text-5xl lg:text-[3.4rem]">
            لا تجمع الدروس.
            <br />
            ابنِ <span className="text-flame">دليلًا</span> على ما
            <br />
            تستطيع فعله.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-ink/70">
            برنامج عربي عملي لتعلّم التسويق الرقمي والذكاء الاصطناعي من خلال مشروع
            واحد: من الجمهور والعرض إلى SEO والمحتوى والحملات التجريبية
            والـPortfolio.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#journey"
              className="group inline-flex items-center gap-2 rounded-lg bg-flame px-6 py-3.5 font-heading text-sm font-semibold text-paper shadow-cut-ink transition-transform hover:-translate-y-0.5"
            >
              ابدأ من الأسبوع الأول
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#portfolio"
              className="font-heading text-sm font-semibold text-ink underline decoration-flame decoration-2 underline-offset-8 transition-colors hover:text-flame"
            >
              شاهد المشروع النهائي
            </a>
          </div>
        </div>

        {/* الصورة + قاعدة اليوم */}
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto max-w-xl rotate-[-1.2deg] rounded-2xl border border-ink/10 bg-paper p-3 shadow-cut-blush lg:max-w-none">
            <Image
              src="/growth/hero-desk.png"
              alt="مكتب دراسة: مخطط أسبوعي مفتوح وحاسوب يعرض رسومًا بيانية وأدوات كتابة"
              width={1152}
              height={864}
              priority
              className="h-64 w-full rounded-xl object-cover sm:h-80 lg:h-[420px]"
            />
            {/* ملصق قاعدة اليوم */}
            <div className="absolute -bottom-7 right-6 w-60 rotate-[3deg] rounded-md border border-ink/10 bg-paper px-4 py-3 shadow-cut-flame sm:w-64">
              <p className="font-label text-[10px] font-medium text-flame-deep">
                Today&apos;s Rule
              </p>
              <p className="mt-1 font-heading text-sm font-semibold leading-6 text-ink">
                اليوم ليس مشاهدة؛ اليوم مخرج يضاف إلى ملفك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsBar() {
  const completedDays = useGrowthStore((s) => s.completedDays);
  const setActiveWeek = useGrowthStore((s) => s.setActiveWeek);
  const openDay = useGrowthStore((s) => s.openDay);

  // أول يوم غير مكتمل في الخطة = نقطة الاستئناف
  const nextDay = DAYS.find((d) => !completedDays.includes(d.id)) ?? null;
  const allDone = completedDays.length >= TOTAL_DAYS;
  const showResume = !allDone && completedDays.length > 0 && nextDay !== null;

  const resume = () => {
    if (!nextDay) return;
    setActiveWeek(nextDay.week);
    openDay(nextDay.id);
    document.getElementById("today")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "1", label: "مشروع موحّد" },
    { value: "12", label: "قسماً للـPortfolio" },
    { value: "42", label: "يوماً" },
  ];
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <ul className="grid flex-1 grid-cols-3 gap-4 sm:gap-10 md:max-w-md">
          {stats.map((s) => (
            <li key={s.label} className="text-center md:text-right">
              <p className="font-heading text-3xl font-bold sm:text-4xl" dir="ltr">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-paper/65">{s.label}</p>
            </li>
          ))}
        </ul>
        <div className="flex max-w-sm flex-wrap items-center gap-4">
          <p className="flex items-start gap-3 text-sm leading-7 text-paper/80">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-flame text-flame" aria-hidden="true">
              ✓
            </span>
            {allDone
              ? "أنجزت الـ42 يومًا كلها — صدّر نسخة JSON النهائية واحتفظ بها مع ملفك."
              : "يعتمد التقدم على ما تنجزه، لا على عدد الفيديوهات. احفظ نسخة JSON من تقدمك بانتظام."}
          </p>
          {showResume && (
            <button
              onClick={resume}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-flame px-4 py-2.5 font-heading text-sm font-semibold text-paper shadow-cut-ink transition-transform hover:-translate-y-0.5"
              aria-label={`أكمل من حيث توقفت: اليوم ${nextDay?.id}`}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              أكمل من حيث توقفت — اليوم {nextDay?.id}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
