"use client";
import Articles from "../_Articles/Articles";
import AuthButton from "./_components/AuthButton";
import CreateArticle from "./_components/CreateArticle";
const Page = () => {
  return (
    <div>
      <AuthButton />
      <CreateArticle />
      <div className="px-5">
        <Articles admin={true} />
      </div>
    </div>
  );
};
export default Page;
