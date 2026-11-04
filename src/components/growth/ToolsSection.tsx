"use client";

import Image from "next/image";
import { TOOLS } from "@/lib/growth/data";

export function ToolsSection() {
  return (
    <section id="tools" className="relative scroll-mt-24 overflow-hidden bg-ink py-16 text-paper lg:py-24">
      {/* الخلفية */}
      <Image
        src="/growth/tools-dark.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-30"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/80 to-ink/60" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-10">
        {/* النص */}
        <div>
          <p className="font-label text-xs font-medium text-flame">
            04 / أدوات قليلة، تفكير أكثر
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-snug sm:text-4xl lg:text-[2.6rem]">
            Marketing هو المهارة.{" "}
            <span className="text-flame">AI</span> مضاعف لها.
          </h2>
          <p className="mt-4 max-w-lg leading-8 text-paper/75">
            لا تحتاج عشرين أداة. استخدم مجموعة صغيرة، وأضف كل قرار في الكشكول
            أو مجلد المشروع، ثم طوّر نظامك بعد بناء الأساس.
          </p>
        </div>

        {/* بطاقات الأدوات */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              className="torn-top relative bg-paper p-5 text-ink transition-transform hover:-translate-y-1"
            >
              <span
                className="absolute right-5 top-0 h-1.5 w-10 bg-flame"
                aria-hidden="true"
              />
              <p className="font-label text-[10px] font-medium text-flame-deep" dir="ltr">
                {tool.tag}
              </p>
              <h3 className="mt-1.5 font-heading text-lg font-bold" dir="auto">
                {tool.name}
              </h3>
              <p className="mt-1.5 text-sm leading-7 text-ink/75">{tool.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
