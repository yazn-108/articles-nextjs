import { ArticleTY } from "@/types/Articles";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/article/${articleSlug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      locale: "ar",
      url: `/article/${articleSlug}`,
      siteName: "مُركَّز",
      images: [
        {
          url: article.banner.url || "/default-og-image.jpg",
          alt: article.banner.alt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      creator: "@yazn_108",
      images: [
        {
          url: article.banner.url || "/default-og-image.jpg",
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
  return <PresentationalArticleDetails article={article} />;
};
export default Page;
