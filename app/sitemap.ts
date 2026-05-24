import { getColl } from '@/lib/mongodb';
import type { MetadataRoute } from 'next';
const BASE_URL = process.env.url || 'https://murakkaz.vercel.app';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coll = await getColl({
    dbName: "articles-database",
    collectionName: "articles-list",
  });
  if (!coll) return [];
  const articles = await coll
    .find(
      { SubscribersNotified: true },
      { projection: { slug: 1, createdAt: 1 } }
    )
    .sort({ createdAt: -1 })
    .toArray();
  const sitemapEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/article/${encodeURIComponent(article.slug)}`,
    lastModified: article.createdAt ? new Date(article.createdAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about-yazn-108`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/rss.xml`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...sitemapEntries,
  ];
}