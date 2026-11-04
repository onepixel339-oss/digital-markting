"use client";

import Image from "next/image";
import { Flag } from "lucide-react";
import { PORTFOLIO_SECTIONS } from "@/lib/growth/data";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="scroll-mt-24 bg-cream py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        {/* النص والشبكة */}
        <div>
          <p className="font-label text-xs font-medium text-flame-deep">
            03 / مشروع النهاية
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-snug text-ink sm:text-4xl lg:text-[2.6rem]">
            لا تنتهي الخطة عند الأسبوع السادس.
          </h2>
          <p className="mt-4 max-w-xl leading-8 text-ink/70">
            تخرج بدراسة حالة لمشروع واحد، لا ملخص نظري. اجمع الاستراتيجية
            والمحتوى والبحث والحملة التجريبية والقياس والـAI Workflow في ملف
            واضح عن CodeSpark AI.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PORTFOLIO_SECTIONS.map((s) => (
              <li
                key={s.n}
                className="flex items-center justify-between gap-2 rounded-lg border border-ink/12 bg-paper px-3.5 py-2.5 transition-shadow hover:shadow-cut-blush"
              >
                <span className="font-heading text-sm font-semibold text-ink" dir="ltr">
                  {s.label}
                </span>
                <span className="font-label text-[10px] text-flame-deep" dir="ltr">
                  {s.n}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* الصورة */}
        <div className="relative">
          <div className="relative rotate-[1.2deg] rounded-2xl border border-ink/10 bg-paper p-3 shadow-cut-sage">
            <Image
              src="/growth/portfolio-docs.png"
              alt="مستندات Portfolio مطبوعة: مخطط قمع تحويل وبطاقات Persona وتقويم محتوى"
              width={1152}
              height={864}
              className="h-64 w-full rounded-xl object-cover sm:h-80 lg:h-[420px]"
            />
            <span className="absolute -bottom-5 left-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-md bg-ink px-4 py-2 font-heading text-xs font-semibold text-paper shadow-cut-ink">
              <Flag className="h-3.5 w-3.5 text-flame" aria-hidden="true" />
              12 قسماً جاهزة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
