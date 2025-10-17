import React from "react";
import ArticlesState from "./_Articles/_components/ArticlesState";
import dynamic from "next/dynamic";
import initialArticlesHook from "./_Articles/_components/initialArticlesHook";
const Articles = dynamic(() => import("./_Articles/Articles"), {
  loading: () => (
    <ArticlesState>
      <ArticlesState.loading />
    </ArticlesState>
  ),
});
const page = async () => {
  const { initialArticles } = await initialArticlesHook();
  return (
    <div className="p-5 space-y-4">
      <h1 className="text-3xl md:text-4xl text-center font-bold">مُركَّز</h1>
      <p className="text-center text-xl md:text-2xl text-secondary max-w-4xl m-auto">
        مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية
        بدون كثرة مقدمات او تمطيط للكلام....
      </p>
      <Articles initialArticles={initialArticles} />
    </div>
  );
};
export default page;
