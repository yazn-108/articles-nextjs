import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://murakkaz.vercel.app/',
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://murakkaz.vercel.app/about-yazn-108',
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://murakkaz.vercel.app/privacy-policy',
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
