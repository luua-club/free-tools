import { MetadataRoute } from 'next'

import { siteConfig, toolsConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()

  const toolRoutes = toolsConfig.map((tool) => ({
    url: `${siteConfig.url}${tool.href}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...toolRoutes,
  ]
}
