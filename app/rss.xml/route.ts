import { getColl } from "@/lib/mongodb";
import { ArticleBlock } from "@/types/Articles";
export async function GET() {
  const coll = await getColl({
    dbName: "articles-database",
    collectionName: "articles-list",
  });
  if (!coll) {
    return new Response(JSON.stringify({ error: "Collection not found" }), {
      status: 500,
    });
  }
  const rssData = await coll
    .find({ SubscribersNotified: { $ne: false } })
    .sort({ createdAt: -1 })
    .toArray();
  const escape = (str: string = "") =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  const buildContent = (blocks: ArticleBlock[] = []) => {
    return blocks
      .map((b) => {
        let html = "";
        if (b.title) {
          html += `<h2>${escape(b.title)}</h2>\n`;
        }
        if (b.content) {
          html += `<p>${escape(b.content)}</p>\n`;
        }
        if (b.code?.content) {
          html += `
          <p>${escape(b.code.language)}</p>
          <pre><code>${escape(b.code.content)}</code></pre>\n`;
        }
        if (b.image?.url) {
          html += `<img src="${b.image.url}" alt="${escape(
            b.image.alt || ""
          )}" loading="lazy" />\n`;
        }
        return html.trim();
      })
      .filter(Boolean)
      .join("\n\n<hr/>\n\n");
  };
  const items = rssData
    .map((article) => {
      const fullContent = buildContent(article.blocks || []);
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${process.env.url}/article/${article.slug}</link>
          <guid isPermaLink="false">${article._id}</guid>
          <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[${article.description || ""}]]></description>
          ${article.banner?.url
          ? `<enclosure url="${article.banner.url}" type="image/png" />`
          : ""
        }
          <content:encoded><![CDATA[
        ${fullContent}
          ]]></content:encoded>
        </item>`;
    })
    .join("");
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"
          xmlns:content="http://purl.org/rss/1.0/modules/content/"
          xmlns:atom="http://www.w3.org/2005/Atom"
        >
        <channel>
          <title><![CDATA[مُركَّز]]></title>
          <description><![CDATA[
        مقالات تقنية مبسطة بدون حشو.
          ]]></description>
          <link>${process.env.url}</link>
          <language>ar</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          <generator>Murakkaz RSS Engine</generator>
          <atom:link href="${process.env.url}/rss.xml" rel="self" type="application/rss+xml" />
          ${items}
        </channel>
        </rss>`;
  const headers = new Headers({ 'content-type': 'application/xml' })
  return new Response(rssFeed, { headers })
}