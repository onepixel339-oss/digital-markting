import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, DM_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegister } from "@/components/growth/ServiceWorkerRegister";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "مسار 42 | Digital Marketing + AI",
  description:
    "برنامج عربي تفاعلي من 42 يومًا لتعلّم التسويق الرقمي والذكاء الاصطناعي عبر مخرجات عملية ومشروع Portfolio.",
  keywords: [
    "التسويق الرقمي",
    "Digital Marketing",
    "AI Marketing",
    "Persona",
    "Funnel",
    "SEO",
    "Portfolio",
  ],
  openGraph: {
    title: "مسار 42 | Digital Marketing + AI",
    description:
      "برنامج عربي تفاعلي من 42 يومًا لتعلّم التسويق الرقمي والذكاء الاصطناعي عبر مخرجات عملية ومشروع Portfolio.",
    type: "website",
    locale: "ar",
  },
  twitter: {
    card: "summary_large_image",
    title: "مسار 42 | Digital Marketing + AI",
    description:
      "برنامج عربي تفاعلي من 42 يومًا لتعلّم التسويق الرقمي والذكاء الاصطناعي عبر مخرجات عملية ومشروع Portfolio.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f1e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${plexArabic.variable} ${notoArabic.variable} ${dmMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <ServiceWorkerRegister />
        <Toaster />
      </body>
    </html>
  );
}
