import type { Metadata } from "next";
import { WeekView, WeekNotFound } from "@/components/growth/WeekView";
import { WEEKS, type GrowthWeek } from "@/lib/growth/data";

export function generateStaticParams() {
  return WEEKS.map((w) => ({ id: String(w.id) }));
}

function weekFromId(id: string): GrowthWeek | undefined {
  const n = Number(id);
  return WEEKS.find((w) => w.id === n);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const week = weekFromId(id);
  if (!week) return { title: "أسبوع غير موجود | مسار 42" };
  return {
    title: `${week.title} — الأسبوع ${week.id} | مسار 42`,
    description: week.description,
  };
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = weekFromId(id);
  if (!week) {
    return <WeekNotFound id={id} />;
  }
  return <WeekView week={week} />;
}
