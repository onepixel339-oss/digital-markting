"use client";

import { useMemo, useRef, useState } from "react";
import {
  ClipboardCheck,
  Download,
  Eraser,
  FileJson,
  Link2,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TOTAL_DAYS } from "@/lib/growth/data";
import {
  buildProgressFile,
  downloadBlob,
  parseProgressFile,
  progressFileName,
  progressPercent,
  useGrowthStore,
  type ProgressFile,
} from "@/lib/growth/store";

export function ProgressPanel() {
  const { toast } = useToast();
  const name = useGrowthStore((s) => s.name);
  const completedDays = useGrowthStore((s) => s.completedDays);
  const clearFilters = useGrowthStore((s) => s.clearFilters);
  const resetProgress = useGrowthStore((s) => s.resetProgress);
  const replaceFromFile = useGrowthStore((s) => s.replaceFromFile);
  const mergeFromFile = useGrowthStore((s) => s.mergeFromFile);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<ProgressFile | null>(null);

  const percent = useMemo(() => progressPercent(completedDays), [completedDays]);

  // ─── تصدير JSON ───
  const exportJson = () => {
    if (completedDays.length === 0 && !name) {
      toast({
        title: "لا يوجد ما يُصدَّر بعد",
        description: "ثبّت إنجاز يوم واحد على الأقل أو سجّل اسمك، ثم صدّر نسختك.",
      });
      return;
    }
    const file = buildProgressFile(name, completedDays);
    downloadBlob(
      JSON.stringify(file, null, 2),
      progressFileName(name),
      "application/json"
    );
    toast({
      title: "تم تنزيل نسخة JSON ✓",
      description: "احتفظ بالملف في مكان آمن — استورده لاحقًا لنقل تقدمك لأي جهاز.",
    });
  };

  // ─── اختيار ملف للاستيراد ───
  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // للسماح بإعادة اختيار نفس الملف
    if (!file) return;
    if (file.size > 1024 * 512) {
      toast({ title: "الملف كبير جدًا", description: "أقصى حجم مسموح 512KB." });
      return;
    }
    const raw = await file.text();
    const result = parseProgressFile(raw);
    if (!result.ok) {
      toast({ title: "ملف غير صالح", description: result.error });
      return;
    }
    setPendingFile(result.file);
  };

  // ─── تأكيد الاستيراد ───
  const applyImport = (mode: "replace" | "merge") => {
    if (!pendingFile) return;
    if (mode === "replace") {
      replaceFromFile(pendingFile);
    } else {
      mergeFromFile(pendingFile);
    }
    const applied = pendingFile.completedDays.length;
    toast({
      title: mode === "replace" ? "تم الاستبدال ✓" : "تم الدمج ✓",
      description: `أُضيف تقدم ${applied} يومًا إلى لوحتك${pendingFile.name ? ` باسم ${pendingFile.name}` : ""}.`,
    });
    setPendingFile(null);
  };

  return (
    <section className="bg-cream-deep pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative grid gap-10 lg:grid-cols-2">
          {/* لوحة التقدم */}
          <div className="rounded-xl border border-ink/12 bg-paper p-6 shadow-cut-sage sm:p-8">
            <p className="font-label text-xs font-medium text-flame-deep">
              Your Browser Progress
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <ClipboardCheck className="h-10 w-10 text-flame" aria-hidden="true" />
              <div className="text-left">
                <p className="font-heading text-5xl font-bold text-ink" dir="ltr">
                  {percent}%
                </p>
                <p className="mt-1 text-sm text-ink/75" dir="rtl">
                  {completedDays.length} من {TOTAL_DAYS} يومًا مُثبَتًا
                  {name ? ` — باسم ${name}` : ""}
                </p>
              </div>
            </div>

            <div
              className="mt-5 h-3 overflow-hidden rounded-full bg-ink/10"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="نسبة التقدم"
            >
              <div
                className="h-full rounded-full bg-flame transition-all duration-500"
                style={{ width: `${Math.max(percent, 1.5)}%` }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-ink/75">
              تقدمك محفوظ على هذا المتصفح فقط. صدّر نسخة JSON احتياطية بانتظام،
              واستوردها على أي جهاز لمتابعة المسار من حيث توقفت.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={exportJson}
                className="h-11 gap-2 bg-ink font-heading text-paper shadow-cut-ink hover:-translate-y-0.5"
              >
                <FileJson className="h-4 w-4" aria-hidden="true" />
                تصدير JSON
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-11 gap-2 border-ink/30 bg-paper font-heading text-ink hover:border-flame hover:text-flame"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                استيراد JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onFilePicked}
                aria-hidden="true"
                tabIndex={-1}
              />
              <Button
                onClick={() => {
                  clearFilters();
                  toast({ title: "مُسحت الفلاتر" });
                }}
                variant="ghost"
                className="h-11 gap-2 font-heading text-flame-deep hover:text-flame"
              >
                <Eraser className="h-4 w-4" aria-hidden="true" />
                مسح الفلاتر
              </Button>
              <Button
                onClick={() => {
                  if (
                    window.confirm(
                      "سيُمسح كل تقدمك على هذا المتصفح (لا يمس ملفات JSON التي صدّرتها). هل أنت متأكد؟"
                    )
                  ) {
                    resetProgress();
                    toast({ title: "أُعيد ضبط التقدم" });
                  }
                }}
                variant="ghost"
                className="h-11 gap-2 font-heading text-ink/70 hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                تصفير التقدم
              </Button>
            </div>
          </div>

          {/* إرشادات الملف */}
          <div className="torn-both bg-sage/70 p-8 sm:p-10">
            <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              ملفك، ملكك.
            </h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-ink/80">
              <li className="flex gap-3">
                <FileJson className="mt-1 h-4 w-4 shrink-0 text-flame-deep" aria-hidden="true" />
                <span>
                  <strong className="font-heading text-ink">التصدير</strong> ينزل ملف
                  JSON فيه اسمك وقائمة الأيام المُثبَتة وتاريخ الحفظ.
                </span>
              </li>
              <li className="flex gap-3">
                <Upload className="mt-1 h-4 w-4 shrink-0 text-flame-deep" aria-hidden="true" />
                <span>
                  <strong className="font-heading text-ink">الاستيراد</strong> يتحقق من
                  صحة الملف أولًا، ثم يسألك: استبدال أم دمج؟ — لا شيء يُمسح بصمت.
                </span>
              </li>
              <li className="flex gap-3">
                <Link2 className="mt-1 h-4 w-4 shrink-0 text-flame-deep" aria-hidden="true" />
                <span>
                  <strong className="font-heading text-ink">روابط مباشرة</strong> — لكل
                  يوم رابط خاص ‎(#day-N)‎ ولكل أسبوع صفحة ‎/week/N‎؛ انسخه لتعود من
                  حيث توقفت أو تشاركه مع غيرك.
                </span>
              </li>
              <li className="flex gap-3">
                <ClipboardCheck className="mt-1 h-4 w-4 shrink-0 text-flame-deep" aria-hidden="true" />
                <span>
                  لا حسابات ولا خوادم ولا قواعد بيانات — بياناتك لا تغادر متصفحك
                  إلا حين تقرر ذلك بتصدير الملف.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* حوار تأكيد الاستيراد */}
      <Dialog
        open={pendingFile !== null}
        onOpenChange={(v) => !v && setPendingFile(null)}
      >
        <DialogContent className="sm:max-w-md rounded-xl border-2 border-ink bg-paper shadow-cut-ink">
          <DialogHeader className="space-y-3 text-right">
            <DialogTitle className="font-heading text-xl">
              ملف تقدم جاهز للاستيراد
            </DialogTitle>
            <DialogDescription className="leading-7">
              {pendingFile && (
                <>
                  يحتوي الملف على{" "}
                  <strong className="text-flame-deep">
                    {pendingFile.completedDays.length} يومًا مُثبَتًا
                  </strong>
                  {pendingFile.name ? ` باسم ${pendingFile.name}` : ""}
                  {pendingFile.savedAt
                    ? ` — محفوظ في ${new Date(pendingFile.savedAt).toLocaleDateString("ar-EG")}`
                    : ""}
                  .
                  <br />
                  تقدمك الحالي: {completedDays.length} يومًا{name ? ` باسم ${name}` : ""}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
            <Button
              onClick={() => applyImport("merge")}
              className="h-11 w-full bg-flame font-heading text-paper hover:bg-flame-deep"
            >
              دمج مع تقدمي الحالي
            </Button>
            <Button
              onClick={() => applyImport("replace")}
              variant="outline"
              className="h-11 w-full border-flame font-heading text-flame-deep hover:bg-flame hover:text-paper"
            >
              استبدال تقدمي بالملف
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPendingFile(null)}
              className="h-10 w-full text-ink/75"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
