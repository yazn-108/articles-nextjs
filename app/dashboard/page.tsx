"use client";
import Articles from "../_Articles/Articles";
import AuthButton from "./_components/AuthButton";
import CreateArticle from "./_components/CreateArticle";
const Page = () => {
  return (
    <div>
      <AuthButton />
      <CreateArticle />
      <Articles admin={true} />
    </div>
  );
};
export default Page;
