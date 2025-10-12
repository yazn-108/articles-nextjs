import type { Metadata } from "next";
import Script from "next/script";
export const metadata: Metadata = {
  title: "شروط استخدام منصة مُركَّز",
  description:
    "حياك الله في منصة مُركَّز. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط التالية:",
  metadataBase: new URL("https://murakkaz.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "ar",
    url: "https://murakkaz.vercel.app/terms-of-use",
    siteName: "مُركَّز",
    title: "شروط استخدام منصة مُركَّز",
    description:
      "حياك الله في منصة مُركَّز. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط التالية:",
    images: [
      {
        url: "https://murakkaz.vercel.app/terms-of-use.png",
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
            name: "شروط استخدام منصة مُركَّز",
            url: "https://murakkaz.vercel.app/terms-of-use",
            description:
              "حياك الله في منصة مُركَّز. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط التالية:",
            inLanguage: "ar",
            publisher: {
              "@type": "Person",
              name: "yazn_108",
              url: "https://yazn-108.github.io/",
            },
            image: "https://murakkaz.vercel.app/terms-of-use.png",
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
