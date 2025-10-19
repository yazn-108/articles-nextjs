import ArticlesState from "./ArticlesState";
const initialArticlesHook = async ({ tag }: { tag: string }) => {
  const res = await fetch(`${process.env.url}/api/tags/${tag}?page=1&limit=6`, {
    next: { revalidate: 1000 * 60 * 5 },
  });
  if (!res.ok) {
    <ArticlesState>
      <ArticlesState.error />
    </ArticlesState>;
  }
  const initialArticles = await res.json();
  if (initialArticles.articles.length === 0) {
    <ArticlesState>
      <ArticlesState.empty />
    </ArticlesState>;
  }
  return { initialArticles };
};
export default initialArticlesHook;
