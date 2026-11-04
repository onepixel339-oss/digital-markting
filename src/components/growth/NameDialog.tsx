"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGrowthStore } from "@/lib/growth/store";
import { TOTAL_DAYS } from "@/lib/growth/data";
import { UserRound } from "lucide-react";

export function NameDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const name = useGrowthStore((s) => s.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <NameForm key={name} initialName={name} onOpenChange={onOpenChange} />}
    </Dialog>
  );
}

// يُركَّب من جديد مع كل فتح — فيأخذ الاسم الحالي دون effects
function NameForm({
  initialName,
  onOpenChange,
}: {
  initialName: string;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const completedDays = useGrowthStore((s) => s.completedDays);
  const setName = useGrowthStore((s) => s.setName);
  const [value, setValue] = useState(initialName);

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      toast({ title: "اكتب اسمًا أولًا", description: "الاسم يظهر في لوحة تقدمك فقط." });
      return;
    }
    setName(trimmed);
    onOpenChange(false);
    toast({
      title: `أهلًا ${trimmed} 👋`,
      description: "تقدمك محفوظ على هذا المتصفح — صدّر نسخة JSON من لوحة التقدم أسفل الصفحة.",
    });
  };

  return (
    <DialogContent className="sm:max-w-md bg-paper border-2 border-ink shadow-cut-ink rounded-xl">
        <DialogHeader className="text-right space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-flame/10 text-flame">
            <UserRound className="h-6 w-6" />
          </div>
          <DialogTitle className="font-heading text-2xl text-center">
            ما اسمك على المسار؟
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            الاسم ليس حسابًا ولا كلمة سر — مجرد توقيع يظهر على لوحة تقدمك.
            <br />
            بياناتك تبقى على جهازك فقط، وينتقل تقدمك بين الأجهزة بملف JSON.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="مثال: أحمد"
            maxLength={40}
            className="h-11 text-base bg-white border-2 border-ink/25 focus-visible:ring-flame"
            aria-label="اسمك"
            autoFocus
          />
          <p className="text-xs text-muted-foreground text-center">
            تقدمك الحالي على هذا المتصفح: {completedDays.length} من {TOTAL_DAYS} يومًا
          </p>
        </div>
        <DialogFooter className="gap-2 sm:justify-center">
          <Button
            onClick={save}
            className="bg-flame hover:bg-flame-deep text-paper font-heading h-11 px-8"
          >
            حفظ الاسم
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-ink/25 h-11"
          >
            لاحقًا
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}

// زر الترويسة الذي يفتح نافذة الاسم
export function NameGateButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const name = useGrowthStore((s) => s.name);
  const [open, setOpen] = useState(false);

  // لو المستخدم على صفحة الأسبوع، الزر يرجعه للرئيسية
  const goHome = () => {
    if (pathname.startsWith("/week/")) router.push("/#today");
  };

  return (
    <>
      <button
        onClick={() => {
          goHome();
          setOpen(true);
        }}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-lg border-2 border-flame bg-paper px-4 py-2 text-sm font-heading text-flame-deep transition-colors hover:bg-flame hover:text-paper"
        }
      >
        <UserRound className="h-4 w-4" />
        {name ? `ملفي: ${name}` : "سجّل اسمك"}
      </button>
      <NameDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
