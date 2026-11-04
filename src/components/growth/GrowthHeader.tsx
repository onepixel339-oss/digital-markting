"use client";

import { LogoMark } from "./LogoMark";
import { NameGateButton } from "./NameDialog";

const NAV = [
  { href: "#journey", label: "مسار الأسابيع" },
  { href: "#today", label: "خطة اليوم" },
  { href: "#portfolio", label: "المشروع النهائي" },
  { href: "#tools", label: "أدوات قليلة" },
];

export function GrowthHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/12 bg-cream/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        {/* الهوية */}
        <a href="/#top" className="flex items-center gap-3" aria-label="العودة إلى بداية موقع مسار 42">
          <LogoMark className="h-11 w-11 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-label text-[10px] font-medium text-flame-deep">
              Growth Ledger
            </span>
            <span className="font-heading text-xl font-bold text-ink">
              مسار / 42
            </span>
          </span>
        </a>

        {/* التنقل */}
        <nav aria-label="التنقل الرئيسي" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-ink/75 transition-colors hover:text-flame"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* الإجراءات */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NameGateButton />
          <a
            href="#today"
            className="hidden rounded-lg bg-ink px-4 py-2 text-sm font-heading text-paper transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            افتح يومك
          </a>
        </div>
      </div>
    </header>
  );
}
