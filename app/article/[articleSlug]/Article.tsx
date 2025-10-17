import React from "react";
import PresentationalArticle from "./PresentationalArticle";
import ArticleNotFound from "./_components/ArticleNotFound";
const Article = async ({ articleSlug }: { articleSlug: string }) => {
  const res = await fetch(`${process.env.url}/api/articles/${articleSlug}`, {
    next: { revalidate: 1000 * 60 * 5 },
  });
  if (!res.ok) return <ArticleNotFound />;
  const article = await res.json();
  return <PresentationalArticle article={article} />;
};
export default Article;
