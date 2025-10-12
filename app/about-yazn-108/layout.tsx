import type { Metadata } from "next";
import Script from "next/script";
export const metadata: Metadata = {
  title: "من هو مطور المواقع يزن أحمد؟ | مُركَّز",
  description:
    "أنا يزن أحمد او المعروف بـyazn_108، مطور مواقع من سوريا أدرس كطالب هندسة كمبيوتر في جامعة اسطنبول GEDIK في تركيا  أسعى لمشاركة خبراتي التقنية واليومية عبر منصة مُركَّز، أحاول تطوير نفسي في مجال تطوير واجهات المواقع من قرابة الـ4 سنوات من أيام الثانوية، تعلمت بفضل الله عدة مهارات إن كانت تقنية تتعلق بالمجال أو مهارات عملية كالتواصل مع مختلف الناس بشكل احترافي.",
  metadataBase: new URL("https://murakkaz.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "ar",
    url: "https://murakkaz.vercel.app/about-yazn-108",
    siteName: "مُركَّز",
    title: "من هو مطور المواقع يزن أحمد؟ | مُركَّز",
    description:
      "أنا يزن أحمد او المعروف بـyazn_108، مطور مواقع من سوريا أدرس كطالب هندسة كمبيوتر في جامعة اسطنبول GEDIK في تركيا  أسعى لمشاركة خبراتي التقنية واليومية عبر منصة مُركَّز، أحاول تطوير نفسي في مجال تطوير واجهات المواقع من قرابة الـ4 سنوات من أيام الثانوية، تعلمت بفضل الله عدة مهارات إن كانت تقنية تتعلق بالمجال أو مهارات عملية كالتواصل مع مختلف الناس بشكل احترافي.",
    images: [
      {
        url: "https://murakkaz.vercel.app/yazn-108-image.jpg",
        alt: "مُركَّز",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yazn_108",
    creator: "@yazn_108",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Script
        id="website-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "من هو مطور المواقع يزن أحمد؟ | مُركَّز",
            url: "https://murakkaz.vercel.app/about-yazn-108",
            description:
              "أنا يزن أحمد او المعروف بـyazn_108، مطور مواقع من سوريا أدرس كطالب هندسة كمبيوتر في جامعة اسطنبول GEDIK في تركيا  أسعى لمشاركة خبراتي التقنية واليومية عبر منصة مُركَّز، أحاول تطوير نفسي في مجال تطوير واجهات المواقع من قرابة الـ4 سنوات من أيام الثانوية، تعلمت بفضل الله عدة مهارات إن كانت تقنية تتعلق بالمجال أو مهارات عملية كالتواصل مع مختلف الناس بشكل احترافي.",
            inLanguage: "ar",
            publisher: {
              "@type": "Person",
              name: "yazn_108",
              url: "https://yazn-108.github.io/",
            },
            image: "https://murakkaz.vercel.app/yazn-108-image.jpg",
            sameAs: [
              "https://x.com/yazn_108",
              "https://github.com/yazn-108",
              "https://t.me/yazn108",
              "https://www.linkedin.com/in/yazn-ahmed",
            ],
          }),
        }}
      />
    </>
  );
}
