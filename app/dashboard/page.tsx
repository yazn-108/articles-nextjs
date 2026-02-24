"use client";
import Articles from "../_Articles/Articles";
import AuthButton from "./components/AuthButton";
const Page = () => {
  return (
    <div>
      <AuthButton />
      <Articles />
    </div>
  );
};
export default Page;
