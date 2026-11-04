import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { LogoMark } from "@/components/growth/LogoMark";

export const metadata = {
  title: "الصفحة غير موجودة | مسار 42",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <LogoMark className="h-16 w-16" />
      <p className="font-label text-xs font-medium text-flame-deep" dir="ltr">
        404
      </p>
      <h1 className="flex items-center gap-3 font-heading text-3xl font-bold text-ink sm:text-4xl">
        <SearchX className="h-8 w-8 text-flame" aria-hidden="true" />
        الصفحة غير موجودة
      </h1>
      <p className="max-w-md leading-8 text-ink/70">
        الرابط الذي فتحته غير موجود على مسار / 42. المسار صفحة واحدة، وأسابيعه
        الستة تبدأ من الرئيسية — أو استخدم رابط يوم مباشر بالشكل
        <span dir="ltr" className="mx-1 font-label text-sm">
          /#day-1
        </span>
        .
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-flame px-6 py-3 font-heading text-sm font-semibold text-paper shadow-cut-ink transition-transform hover:-translate-y-0.5"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        العودة إلى مسار / 42
      </Link>
    </div>
  );
}
