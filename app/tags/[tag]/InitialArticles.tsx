import ArticlesState from "@/app/_Articles/_components/ArticlesState";
import dynamic from "next/dynamic";
import React from "react";
import initialArticlesHook from "./_components/initialArticlesHook";
const Articles = dynamic(() => import("./Articles"), {
  loading: () => (
    <ArticlesState>
      <ArticlesState.loading />
    </ArticlesState>
  ),
});
const InitialArticles = async ({ tag }: { tag: string }) => {
  const { initialArticles } = await initialArticlesHook({ tag });
  return <Articles initialArticles={initialArticles} tag={tag} />;
};
export default InitialArticles;
