import GoBackToHome from "@/app/_components/GoBackToHome";
import React from "react";
const ArticleNotFound = () => {
  return (
    <div className="h-dvh flex flex-col justify-center items-center">
      <p className="text-center text-primary text-xl">
        لم يتم العثور على المقال
      </p>
      <GoBackToHome>
        <GoBackToHome.BackToHome />
      </GoBackToHome>
    </div>
  );
};
export default ArticleNotFound;
