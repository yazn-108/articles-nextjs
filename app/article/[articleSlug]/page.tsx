import React from "react";
import dynamic from "next/dynamic";
import Skeleton from "./_components/Skeleton";
import ArticleNotFound from "./_components/ArticleNotFound";
const PresentationalArticleDetails = dynamic(
  () => import("./PresentationalArticleDetails"),
  {
    loading: () => <Skeleton />,
  }
);
const Page = async ({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) => {
  const { articleSlug } = await params;
  const res = await fetch(`${process.env.url}/api/articles/${articleSlug}`, {
    next: { revalidate: 1000 * 60 * 5 },
  });
  if (!res.ok) return <ArticleNotFound />;
  const article = await res.json();
  return <PresentationalArticleDetails article={article} />;
};
export default Page;
