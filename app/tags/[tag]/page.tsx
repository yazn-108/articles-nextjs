import GoBackToHome from "@/app/_components/GoBackToHome";
import React from "react";
import initialArticlesHook from "@/app/_Articles/_components/initialArticlesHook";
import ArticlesState from "@/app/_Articles/_components/ArticlesState";
import dynamic from "next/dynamic";
const Articles = dynamic(() => import("@/app/_Articles/Articles"), {
  loading: () => (
    <ArticlesState>
      <ArticlesState.loading />
    </ArticlesState>
  ),
});
const Page = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = await params;
  const tagTitle = tag.toLowerCase();
  const { initialArticles } = await initialArticlesHook({ tag: tagTitle });
  return (
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-center">
        <GoBackToHome>
          <GoBackToHome.BackToHomeIcon />
        </GoBackToHome>
        <h3 className="text-3xl md:text-xl text-center font-bold text-secondary space-x-2">
          <span>#</span>
          <span>{tagTitle}</span>
        </h3>
      </div>
      <Articles initialArticles={initialArticles} tag={tagTitle} />
    </div>
  );
};
export default Page;
