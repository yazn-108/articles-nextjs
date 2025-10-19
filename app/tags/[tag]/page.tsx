import GoBackToHome from "@/app/_components/GoBackToHome";
import React, { use } from "react";
import InitialArticles from "./InitialArticles";
const Page = ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = use(params);
  const tagTitle = tag.toLowerCase();
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
      <InitialArticles tag={tagTitle} />
    </div>
  );
};
export default Page;
