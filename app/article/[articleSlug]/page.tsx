import React, { use } from "react";
import dynamic from "next/dynamic";
import Skeleton from "./_components/Skeleton";
const Article = dynamic(() => import("./Article"), {
  loading: () => <Skeleton />,
});
const Page = ({ params }: { params: Promise<{ articleSlug: string }> }) => {
  const { articleSlug } = use(params);
  return <Article articleSlug={articleSlug} />;
};
export default Page;
