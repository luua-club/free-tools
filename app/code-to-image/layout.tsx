import type { Metadata } from 'next'

import { WebsiteJsonLd } from '@/components/seo/json-ld'
import { siteConfig, toolsConfig } from '@/config/site'

const tool = toolsConfig.find((t) => t.href === '/code-to-image')!

export const metadata: Metadata = {
  title: tool.seo.title,
  description: tool.seo.description,
  keywords: [...tool.seo.keywords],
  openGraph: {
    title: tool.seo.title,
    description: tool.seo.description,
    url: `${siteConfig.url}/code-to-image`,
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
    canonical: `${siteConfig.url}/code-to-image`,
  },
}

export default function CodeToImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WebsiteJsonLd type="tool" toolHref="/code-to-image" />
      {children}
    </>
  )
}
