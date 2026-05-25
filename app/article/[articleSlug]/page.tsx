import { ArticleTY } from "@/types/Articles";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import ArticleNotFound from "./_components/ArticleNotFound";
import Skeleton from "./_components/Skeleton";
const PresentationalArticleDetails = dynamic(
  () => import("./PresentationalArticleDetails"),
  {
    loading: () => <Skeleton />,
  },
);
type Props = {
  params: Promise<{
    articleSlug: string;
  }>;
};
async function getArticle(articleSlug: string) {
  const res = await fetch(`${process.env.url}/api/articles/${articleSlug}`, {
    next: { revalidate: 1000 * 60 * 5 },
  });
  if (!res.ok) return null;
  return res.json() as Promise<ArticleTY>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = await getArticle(articleSlug);
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }
  return {
    metadataBase: new URL(process.env.url!),
    title: `${article.title} | مُركَّز`,
    description: article.description,
    alternates: {
      canonical: `/article/${articleSlug}`,
    },
    openGraph: {
      type: "article",
      title: `${article.title} | مُركَّز`,
      description: article.description,
      locale: "ar",
      url: `/article/${articleSlug}`,
      siteName: "مُركَّز",
      images: [
        {
          url: "/default-og-image.jpg",
          alt: article.banner.alt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | مُركَّز`,
      description: article.description,
      creator: "@yazn_108",
      images: [
        {
          url: "/default-og-image.jpg",
          alt: article.banner.alt,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
const Page = async ({ params }: Props) => {
  const { articleSlug } = await params;
  const article = await getArticle(articleSlug);
  if (!article) return <ArticleNotFound />;
  return (
    <>
      <PresentationalArticleDetails article={article} />
      <Script
        id="article-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: `${article.title} | مُركَّز`,
            description: article.description,
            url: `https://murakkaz.vercel.app/article/${article.slug}`,
            image: {
              "@type": "ImageObject",
              url: article.banner.url || "/default-og-image.jpg",
              width: 1200,
              height: 630,
            },
            author: {
              "@type": "Person",
              name: "yazn_108",
              url: "https://yazn-108.github.io/",
              sameAs: [
                "https://x.com/yazn_108",
                "https://github.com/yazn-108",
                "https://www.linkedin.com/in/yazn-ahmed",
              ],
            },
            publisher: {
              "@type": "Organization",
              name: "مُركَّز",
              url: "https://murakkaz.vercel.app/",
              logo: {
                "@type": "ImageObject",
                url: "https://murakkaz.vercel.app/favicon.png",
                width: 512,
                height: 512,
              },
              sameAs: [
                "https://x.com/yazn_108",
                "https://github.com/yazn-108",
                "https://www.linkedin.com/in/yazn-ahmed",
              ],
            },
            datePublished: article.createdAt,
            dateModified: article.createdAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://murakkaz.vercel.app/article/${article.slug}`,
            },
          }),
        }}
      />
    </>
  );
};
export default Page;
