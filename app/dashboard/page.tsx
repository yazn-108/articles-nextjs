"use client";
import Articles from "../_Articles/Articles";
import AuthButton from "./components/AuthButton";
import CreateArticle from "./components/CreateArticle";
const Page = () => {
  return (
    <div>
      <AuthButton />
      <CreateArticle />
      <Articles admin={false} />
    </div>
  );
};
export default Page;
