import type { Metadata } from "next";
import { Playpen_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { TanStackProvider } from "@/hooks/TanStackProvider";
import Image from "next/image";
import Link from "next/link";
import FooterForms from "./_components/FooterForms";
import Search from "./_components/Search/page";
import ScrollToEmail from "./_components/ScrollToEmail";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
const Playpen = Playpen_Sans_Arabic({
  variable: "--font-Playpen_Sans_Arabic",
  subsets: ["arabic"],
});
export const metadata: Metadata = {
  title: "مُركَّز",
  description:
    "مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية بدون كثرة مقدمات.",
  metadataBase: new URL("https://murakkaz.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "ar",
    url: "https://murakkaz.vercel.app/",
    siteName: "مُركَّز",
    title: "مُركَّز",
    description:
      "مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية بدون كثرة مقدمات.",
    images: [
      {
        url: "https://murakkaz.vercel.app/default-og-image.jpg",
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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    google: "pwK6PesUvsdqx4n4qFMAz5xIKE5vpFlYdVpAL2A9D-w",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={`${Playpen.variable} antialiased`}>
        <TanStackProvider>
          <nav className="z-50 flex items-center justify-between p-2 sticky top-0 bg-background border-b border-primary">
            <Link
              href={"/about-yazn-108"}
              className="flex gap-4 justify-start items-center"
              title="تعرف عني"
            >
              <Image
                className="object-cover object-center size-12 rounded-full"
                src={"/yazn-108-image.jpg"}
                width={48}
                height={48}
                alt={"yazn_108 image"}
                suppressHydrationWarning
              />
              <p className="grid text-sm">
                <span className="space-x-1">
                  <span>يزن احمد</span>
                  <span dir="ltr" className="text-[14px] text-secondary">
                    (@yazn_108)
                  </span>
                </span>
                <span className="text-secondary">مطور مواقع فرونت اند</span>
              </p>
            </Link>
            <div className="flex justify-center items-center gap-4">
              <ScrollToEmail />
              <Search />
            </div>
          </nav>
          <main>
            {children}
            <SpeedInsights />
          </main>
          <footer>
            <div dir="rtl" className="border-t border-primary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
                <h2 className="text-4xl font-bold text-gray-100">
                  لا تتصل بنا بل تواصل معي
                </h2>
                <p className="pt-6 pb-6 text-base max-w-2xl text-center m-auto text-gray-400 grid">
                  <span>
                    لا حاجة للتكلف في صياغة الرسالة كل ما تحب ان اساعدك فيه،
                    اخبرني عنه. اذا عندك اي شيء تحب تخبرني عنه فانا جاهز
                    لمساعدتك والهدف من المنصة هو البساطة وتجنب التكلفات
                    والرسميات التي اعتدنا عليها في المواقع حتى اصبحت جميع
                    المواقع لها نمط واحد وان تنوعت في الافكار والاشكال.
                  </span>
                  <span>اهلا وسهلا ومرحبا بك</span>
                </p>
              </div>
              <FooterForms />
            </div>
            <div className="flex flex-col space-y-1 justify-center p-5 border-t border-primary">
              <div
                dir="ltr"
                className="flex justify-center flex-wrap gap-4 text-gray-500 font-medium"
              >
                <Link
                  className="text-primary hover:text-[#344157] transition-all"
                  href="/about-yazn-108"
                >
                  هدف المنصة/من انا؟
                </Link>
                <Link
                  className="text-primary hover:text-[#344157] transition-all"
                  href="/terms-of-use"
                >
                  شروط الاستخدام
                </Link>
              </div>
              <p dir="rtl" className="text-center text-foreground font-medium">
                &copy; جميع الحقوق محفوظة لـ
                <a
                  href="http://yazn-108.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-[#344157] transition-all"
                >
                  yazn_108
                </a>
              </p>
            </div>
          </footer>
        </TanStackProvider>
        <Script
          id="website-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "مُركَّز",
              url: "https://murakkaz.vercel.app/",
              description:
                "مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية بدون كثرة مقدمات.",
              inLanguage: "ar",
              publisher: {
                "@type": "Person",
                name: "yazn_108",
                url: "https://yazn-108.github.io/",
              },
              image: "https://murakkaz.vercel.app/default-og-image.jpg",
              sameAs: [
                "https://x.com/yazn_108",
                "https://github.com/yazn-108",
                "https://t.me/yazn108",
                "https://www.linkedin.com/in/yazn-ahmed",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
