import { ArticleTY } from "@/types/Articles";
const BackupArticles = async ({ event_type, client_payload }: {
  event_type: "article.deleted" | "article.updated" | "article.created"; client_payload: ArticleTY | {
    articleId: string
  }
}) => {
  await fetch("https://api.github.com/repos/yazn-108/murakkaz-articles-backup/dispatches", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BACKUP_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type,
      client_payload,
    }),
  })
}
export default BackupArticles;