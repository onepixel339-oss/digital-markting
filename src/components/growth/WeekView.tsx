"use client";

// صفحة الأسبوع القابلة للمشاركة — /week/[id]
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCopy, FileText, Home, SquareArrowOutUpRight } from "lucide-react";
import { getWeekDays, type GrowthWeek } from "@/lib/growth/data";
import { LogoMark } from "./LogoMark";
import { NameGateButton } from "./NameDialog";

export function WeekView({ week }: { week: GrowthWeek }) {
  const days = getWeekDays(week.id);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // بعض المتصفحات تمنع الحافظة — نتجاهل بصمت
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ترويسة مبسطة */}
      <header className="border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى مسار 42">
            <LogoMark className="h-10 w-10" />
            <span className="font-heading text-lg font-bold text-ink">مسار / 42</span>
          </Link>
          <div className="flex items-center gap-3">
            <NameGateButton />
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-paper px-4 py-2 text-sm font-heading text-ink transition-all hover:-translate-y-0.5 hover:shadow-cut-ink"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-sage-deep" aria-hidden="true" />
                  تم نسخ الرابط
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
                  نسخ رابط الأسبوع
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* ترويسة الأسبوع */}
        <p className="font-label text-xs font-medium text-flame-deep">
          <span dir="ltr">Week {String(week.id).padStart(2, "0")}</span>
          <span className="mx-2 text-ink/30">/</span>
          {week.label}
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="max-w-xl font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl" dir="auto">
            {week.title}
          </h1>
          <div className="torn-both w-full max-w-sm bg-sage/80 p-5">
            <p className="font-label text-[10px] font-medium text-flame-deep">
              مخرج الأسبوع
            </p>
            <p className="mt-1.5 font-heading text-lg font-bold leading-7 text-ink">
              {week.deliverable}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl leading-8 text-ink/70">{week.description}</p>

        {/* جدول الأيام */}
        <div className="mt-10 overflow-hidden rounded-xl border border-ink/15 shadow-cut-blush">
          <table className="w-full border-collapse bg-paper text-right">
            <thead>
              <tr className="bg-ink text-paper">
                <th scope="col" className="px-5 py-3.5 text-right font-heading text-sm">
                  اليوم
                </th>
                <th scope="col" className="hidden px-5 py-3.5 text-right font-heading text-sm sm:table-cell">
                  المهمة والمخرج
                </th>
                <th scope="col" className="px-5 py-3.5 text-right font-heading text-sm">
                  المصدر
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-ink/10 align-top transition-colors hover:bg-cream/60"
                >
                  <td className="w-14 px-5 py-4">
                    <span className="font-label text-sm font-medium text-flame-deep" dir="ltr">
                      {String(d.id).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-5 py-4 sm:table-cell">
                    <span className="block font-heading text-base font-bold text-ink sm:hidden">
                      {d.title}
                    </span>
                    <p className="hidden font-heading text-base font-bold text-ink sm:block">
                      {d.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-6 text-ink/75">{d.subtitle}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink/80">
                      <FileText className="h-4 w-4 shrink-0 text-flame" aria-hidden="true" />
                      {d.deliverable}
                    </p>
                  </td>
                  <td className="w-24 px-5 py-4">
                    <a
                      href={d.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-flame-deep underline decoration-2 underline-offset-4 transition-colors hover:text-flame"
                    >
                      افتح
                      <SquareArrowOutUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> — {d.sourceLabel}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/#today"
            className="group inline-flex items-center gap-2 font-heading text-sm font-semibold text-flame-deep hover:text-flame"
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            العودة إلى لوحة العمل التفاعلية
          </Link>
        </div>
      </main>

      <footer className="mt-auto border-t border-ink/10 bg-cream-deep py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-ink/70 sm:px-6 lg:px-8">
          <p>خريطة تفاعلية من برنامج Digital Marketing + AI.</p>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-flame">
            <Home className="h-4 w-4" aria-hidden="true" />
            الرئيسية
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function WeekNotFound({ id }: { id: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <LogoMark className="h-16 w-16" />
      <h1 className="font-heading text-3xl font-bold text-ink">
        لا يوجد أسبوع رقم {id}
      </h1>
      <p className="max-w-md leading-8 text-ink/75">
        المسار يحتوي على ستة أسابيع فقط من 1 إلى 6. عد إلى اللوحة الرئيسية
        واختر أسبوعًا من خريطة الرحلة.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-flame px-6 py-3 font-heading text-sm font-semibold text-paper shadow-cut-ink"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        العودة إلى مسار / 42
      </Link>
    </div>
  );
}
