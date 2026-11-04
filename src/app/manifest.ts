import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "خطة Digital Marketing + AI خلال 6 أسابيع",
    short_name: "مسار / 42",
    description:
      "برنامج عربي تفاعلي من 42 يومًا لتعلّم التسويق الرقمي والذكاء الاصطناعي عبر مخرجات عملية ومشروع Portfolio.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f1e5",
    theme_color: "#f6f1e5",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
