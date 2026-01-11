import type { Metadata } from 'next'

import { WebsiteJsonLd } from '@/components/seo/json-ld'
import { siteConfig, toolsConfig } from '@/config/site'

const tool = toolsConfig.find((t) => t.href === '/preview')!

export const metadata: Metadata = {
  title: tool.seo.title,
  description: tool.seo.description,
  keywords: [...tool.seo.keywords],
  openGraph: {
    title: tool.seo.title,
    description: tool.seo.description,
    url: `${siteConfig.url}/preview`,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: tool.seo.title,
    description: tool.seo.description,
  },
  alternates: {
    canonical: `${siteConfig.url}/preview`,
  },
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WebsiteJsonLd type="tool" toolHref="/preview" />
      {children}
    </>
  )
}
