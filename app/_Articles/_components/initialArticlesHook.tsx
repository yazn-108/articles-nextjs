import { ArticlesResponse } from "@/types/Articles";
import ArticlesState from "./ArticlesState";
const initialArticlesHook = async ({ tag }: { tag?: string } = {}) => {
  const res = await fetch(
    !tag
      ? `${process.env.url}/api/articles?page=1&limit=6`
      : `${process.env.url}/api/tags/${tag}?page=1&limit=6`,
    {
      next: { revalidate: !tag ? 1000 * 60 * 5 : 0 },
    }
  );
  if (!res.ok) {
    <ArticlesState>
      <ArticlesState.error />
    </ArticlesState>;
  }
  const initialArticles: ArticlesResponse = await res.json();
  if (initialArticles.articles?.length === 0) {
    <ArticlesState>
      <ArticlesState.empty />
    </ArticlesState>;
  }
  return { initialArticles };
};
export default initialArticlesHook;
