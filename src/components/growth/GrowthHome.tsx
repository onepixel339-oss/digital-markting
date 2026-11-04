"use client";

// تركيب الصفحة الرئيسية لمسار / 42
import { useEffect } from "react";
import { GrowthHeader } from "./GrowthHeader";
import { Hero, StatsBar } from "./Hero";
import { WeeksJourney } from "./WeeksJourney";
import { DayPlan } from "./DayPlan";
import { PortfolioSection } from "./PortfolioSection";
import { ToolsSection } from "./ToolsSection";
import { SpecializationSection } from "./SpecializationSection";
import { ProgressPanel } from "./ProgressPanel";
import { GrowthFooter } from "./GrowthFooter";
import { useGrowthStore } from "@/lib/growth/store";
import { useToast } from "@/hooks/use-toast";

export function GrowthHome() {
  const name = useGrowthStore((s) => s.name);
  const completedDays = useGrowthStore((s) => s.completedDays);
  const { toast } = useToast();

  // تذكير أول زيارة بالاسم والنسخة الاحتياطية (مرة واحدة)
  useEffect(() => {
    if (!name && completedDays.length === 0) {
      const seen = window.sessionStorage.getItem("path42-hint-shown");
      if (!seen) {
        window.sessionStorage.setItem("path42-hint-shown", "1");
        const timer = window.setTimeout(() => {
          toast({
            title: "ابدأ باسمك 📝",
            description:
              "اضغط «سجّل اسمك» أعلى الصفحة، وصدّر نسخة JSON من تقدمك كل عدة أيام.",
            duration: 7000,
          });
        }, 2500);
        return () => window.clearTimeout(timer);
      }
    }
  }, [name, completedDays.length, toast]);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <GrowthHeader />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <div className="timeline-edge bg-cream">
          <WeeksJourney />
          <DayPlan />
          <PortfolioSection />
        </div>
        <ToolsSection />
        <SpecializationSection />
        <ProgressPanel />
      </main>
      <GrowthFooter />
    </div>
  );
}
