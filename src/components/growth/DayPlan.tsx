"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  CornerDownLeft,
  ListChecks,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { DAYS, WEEKS, getWeekDays, type GrowthDay } from "@/lib/growth/data";
import { useGrowthStore } from "@/lib/growth/store";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DayPlan() {
  const { toast } = useToast();
  const activeWeek = useGrowthStore((s) => s.activeWeek);
  const setActiveWeek = useGrowthStore((s) => s.setActiveWeek);
  const openDayId = useGrowthStore((s) => s.openDayId);
  const openDay = useGrowthStore((s) => s.openDay);
  const daySearch = useGrowthStore((s) => s.daySearch);
  const setDaySearch = useGrowthStore((s) => s.setDaySearch);
  const completedOnly = useGrowthStore((s) => s.completedOnly);
  const setCompletedOnly = useGrowthStore((s) => s.setCompletedOnly);
  const completedDays = useGrowthStore((s) => s.completedDays);
  const toggleDay = useGrowthStore((s) => s.toggleDay);
  const name = useGrowthStore((s) => s.name);

  const weekDays = useMemo(() => getWeekDays(activeWeek), [activeWeek]);

  // رابط مباشر لكل يوم: ‎/#day-17 يفتح اليوم 17 في أسبوعه — يعمل من أي مشاركة
  useEffect(() => {
    const m = window.location.hash.match(/^#day-(\d+)$/);
    if (!m) return;
    const day = DAYS.find((d) => d.id === Number(m[1]));
    if (!day) return;
    setActiveWeek(day.week);
    openDay(day.id);
    window.history.replaceState(null, "", `/`);
    document.getElementById("today")?.scrollIntoView();
  }, []);

  const filteredDays = useMemo(() => {
    const q = daySearch.trim().toLowerCase();
    return weekDays.filter((d) => {
      if (completedOnly && !completedDays.includes(d.id)) return false;
      if (!q) return true;
      const haystack = [
        d.title,
        d.subtitle,
        d.deliverable,
        ...d.terms,
        `day ${d.id}`,
        `اليوم ${d.id}`,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [weekDays, daySearch, completedOnly, completedDays]);

  const effectiveOpen =
    openDayId && filteredDays.some((d) => d.id === openDayId)
      ? openDayId
      : (filteredDays[0]?.id ?? null);

  const selectedDay =
    DAYS.find((d) => d.id === effectiveOpen) ?? null;

  // اليوم غير المكتمل التالي في كامل الخطة
  const nextDay = DAYS.find((d) => !completedDays.includes(d.id)) ?? null;
  const nextDayDone = nextDay ? completedDays.includes(nextDay.id) : false;

  // فتح يوم مع تحديث الرابط ليصبح قابلاً للمشاركة
  const openDayWithHash = (dayId: number) => {
    openDay(dayId);
    window.history.replaceState(null, "", `#day-${dayId}`);
  };

  const handleToggle = (day: GrowthDay) => {
    const wasDone = completedDays.includes(day.id);
    toggleDay(day.id);
    if (!wasDone) {
      const total = completedDays.length + 1;
      toast({
        title: `منجَز ✓ — اليوم ${day.id}`,
        description: `أحسنت${name ? ` يا ${name}` : ""}! أنجزت ${total} من 42 يومًا. صدّر نسخة JSON من لوحة التقدم لتحتفظ بها.`,
      });
    } else {
      toast({ title: `أُلغي تثبيت اليوم ${day.id}` });
    }
  };

  return (
    <section id="today" className="scroll-mt-24 bg-cream-deep py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="font-label text-xs font-medium text-flame-deep">
            02 / لوحة العمل اليومية
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-snug text-ink sm:text-4xl lg:text-[2.6rem]">
            افتح اليوم، ثم ثبّت الإنجاز.
          </h2>
          <p className="mt-4 leading-8 text-ink/70">
            يمكنك البدء الآن، ثم صدّر ملف JSON من لوحة التقدم لحفظ تقدمك بصورة
            دائمة أو نقله إلى جهاز آخر.
          </p>
        </div>

        {/* أدوات التحكم */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="أسابيع الخطة"
          >
            {WEEKS.map((w) => (
              <button
                key={w.id}
                role="tab"
                aria-selected={w.id === activeWeek}
                onClick={() => {
                  setActiveWeek(w.id);
                  window.history.replaceState(null, "", window.location.pathname);
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-heading transition-all ${
                  w.id === activeWeek
                    ? "border-ink bg-ink text-paper shadow-cut-ink"
                    : "border-ink/20 bg-paper text-ink hover:border-ink/50"
                }`}
              >
                الأسبوع {w.id}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
                aria-hidden="true"
              />
              <Input
                value={daySearch}
                onChange={(e) => setDaySearch(e.target.value)}
                placeholder="ابحث في الأيام والمصطلحات"
                aria-label="البحث في الأيام والمصطلحات"
                className="h-10 w-60 border-2 border-ink/15 bg-paper pr-9 text-sm focus-visible:ring-flame"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/75">
              <Checkbox
                checked={completedOnly}
                onCheckedChange={(v) => setCompletedOnly(v === true)}
                aria-label="المكتمل فقط"
                className="h-4 w-4 border-2 border-ink/40 data-[state=checked]:border-flame data-[state=checked]:bg-flame"
              />
              المكتمل فقط
            </label>
          </div>
        </div>

        {/* اللوحة */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* قائمة الأيام */}
          <div
            className="nice-scroll max-h-[560px] overflow-y-auto rounded-xl border border-ink/12 bg-paper/70 p-2"
            role="list"
            aria-label={`أيام الأسبوع ${activeWeek}`}
          >
            {filteredDays.length === 0 ? (
              <p className="p-10 text-center text-sm text-ink/70">
                لا توجد أيام تطابق البحث أو الفلترة الحالية.
              </p>
            ) : (
              filteredDays.map((d) => {
                const done = completedDays.includes(d.id);
                const isOpen = d.id === effectiveOpen;
                return (
                  <div key={d.id} role="listitem">
                    <button
                      onClick={() => openDayWithHash(d.id)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-right transition-colors ${
                        isOpen
                          ? "bg-ink text-paper"
                          : "hover:bg-paper text-ink"
                      }`}
                    >
                      <span
                        className={`font-label shrink-0 text-[11px] ${
                          isOpen ? "text-flame" : "text-flame-deep"
                        }`}
                        dir="ltr"
                      >
                        {String(d.id).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-heading text-[15px] font-bold leading-6">
                          {d.title}
                        </span>
                        <span
                          className={`block text-xs leading-5 ${
                            isOpen ? "text-paper/65" : "text-ink/70"
                          }`}
                        >
                          {d.deliverable}
                        </span>
                      </span>
                      {done ? (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-deep text-paper" aria-label="مكتمل">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      ) : (
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          } ${isOpen ? "text-paper/70" : "text-ink/40"}`}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    {isOpen && (
                      <div className="mx-3 mb-2 border-b border-dashed border-ink/15" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* تفاصيل اليوم */}
          {selectedDay && (
            <DayDetail
              day={selectedDay}
              done={completedDays.includes(selectedDay.id)}
              onToggle={() => handleToggle(selectedDay)}
              nextDay={nextDay}
              nextDayDone={nextDayDone}
              onGoNext={() => {
                if (nextDay) {
                  setActiveWeek(nextDay.week);
                  openDay(nextDay.id);
                  document
                    .getElementById("today")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function DayDetail({
  day,
  done,
  onToggle,
  nextDay,
  nextDayDone,
  onGoNext,
}: {
  day: GrowthDay;
  done: boolean;
  onToggle: () => void;
  nextDay: GrowthDay | null;
  nextDayDone: boolean;
  onGoNext: () => void;
}) {
  const week = WEEKS.find((w) => w.id === day.week);
  const tasks = [
    { tag: "تعلّم", icon: BookOpen, text: day.tasks.learn },
    { tag: "اكتشف", icon: ListChecks, text: day.tasks.discover },
    { tag: "مهمة AI", icon: Sparkles, text: day.tasks.aiTask },
    { tag: "طبّق", icon: Target, text: day.tasks.apply },
  ];

  return (
    <article className="relative rounded-xl border-2 border-flame bg-paper p-6 shadow-cut-flame sm:p-8">
      {/* تبويب الخطة التالية */}
      {nextDay && !nextDayDone && nextDay.id !== day.id && (
        <button
          onClick={onGoNext}
          className="absolute -top-4 right-6 rotate-[-2deg] rounded-md bg-flame px-3 py-1.5 text-xs font-heading font-semibold text-paper shadow-sm transition-transform hover:rotate-0"
        >
          الخطة التالية: اليوم {nextDay.id} ←
        </button>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-label text-xs font-medium text-flame-deep" dir="rtl">
          <span dir="ltr">DAY {String(day.id).padStart(2, "0")}</span>
          <span className="mx-2 text-ink/30">/</span>
          {week?.label}
        </p>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-cream px-3 py-1 text-xs text-ink/70"
          title="الوقت المذكور تقدير لوقت المحتوى — مش مقياس"
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span dir="ltr">{day.minutes}</span> دقيقة تقديرية
        </span>
      </div>

      <h3 className="mt-3 font-heading text-2xl font-bold text-ink sm:text-3xl">
        {day.title}
      </h3>
      <p className="mt-2 text-ink/75">{day.subtitle}</p>
      <p className="mt-2 text-xs italic leading-6 text-ink/70">
        الوقت المذكور تقدير لوقت المحتوى — مش مقياس. مذاكرتك أنت: خد وقتك
        ومتقلّقش.
      </p>

      {/* بطاقات المهام */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task.tag}
            className="rounded-lg border border-ink/10 bg-cream/70 p-4"
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-heading text-xs font-semibold ${
                  task.tag === "مهمة AI" ? "text-flame-deep" : "text-ink/75"
                }`}
              >
                {task.tag}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  task.tag === "مهمة AI" ? "bg-flame text-paper" : "bg-ink text-paper"
                }`}
              >
                <task.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 text-sm leading-7 text-ink/85">{task.text}</p>
          </div>
        ))}
      </div>

      {/* المخرج + المصطلحات */}
      <div className="torn-both mt-6 bg-sage/80 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-label text-[10px] font-medium text-flame-deep">
              المخرج الذي تضيفه لملفك
            </p>
            <p className="mt-1.5 font-heading text-lg font-bold leading-8 text-ink">
              {day.deliverable}
            </p>
          </div>
          <div className="sm:text-left">
            <p className="font-label text-[10px] font-medium text-ink/75">
              مصطلحات اليوم
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5 sm:justify-end">
              {day.terms.map((term) => (
                <li
                  key={term}
                  className="dir-ltr rounded border border-ink/15 bg-paper px-2 py-0.5 text-xs text-ink/75"
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* تم عندها + زر التثبيت */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
        <p className="text-sm text-ink/70">
          <span className="font-heading font-semibold text-ink">تم عندها:</span>{" "}
          {day.doneWhen}
        </p>
        <Button
          onClick={onToggle}
          aria-pressed={done}
          className={`h-11 gap-2 rounded-lg px-6 font-heading font-semibold ${
            done
              ? "bg-sage-deep text-paper hover:bg-sage-deep/85"
              : "bg-ink text-paper shadow-cut-ink hover:-translate-y-0.5"
          }`}
        >
          {done ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              منجَز
            </>
          ) : (
            <>
              <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
              ثبّت الإنجاز
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
