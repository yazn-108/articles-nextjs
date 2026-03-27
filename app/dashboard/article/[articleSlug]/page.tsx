import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import ArticleNotFound from "./_components/ArticleNotFound";
import Skeleton from "./_components/Skeleton";
const PresentationalArticleDetails = dynamic(
  () => import("./PresentationalArticleDetails"),
  {
    loading: () => <Skeleton />,
  },
);
const Page = async ({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) => {
  const { articleSlug } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const res = await fetch(
    `${process.env.url}/api/admin/articles/${articleSlug}`,
    {
      headers: { cookie: cookieHeader },
    },
  );
  if (!res.ok) return <ArticleNotFound />;
  const article = await res.json();
  return <PresentationalArticleDetails article={article} />;
};
export default Page;
