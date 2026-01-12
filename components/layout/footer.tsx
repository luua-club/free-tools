'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Code, Eye, TrendingUp, Type } from 'lucide-react'

import { siteConfig, toolsConfig } from '@/config/site'

const iconMap = {
  Eye,
  TrendingUp,
  Code,
  Type,
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src="https://framerusercontent.com/images/0zzaQ4ZYVP0TSQivbRRjL5P5FQ.png"
                alt="Luua"
                width={70}
                height={24}
                className="h-6 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free tools for social media creators. Optimize your content before
              you post.
            </p>
          </div>

          {/* Tools */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-semibold">Tools</h4>
            <div className="grid grid-cols-2 gap-3">
              {toolsConfig.map((tool) => {
                const Icon = iconMap[tool.icon as keyof typeof iconMap]
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {tool.title}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://luua.club"
                  target="_blank"
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Luua App
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Luua. All rights reserved.</p>
          <p className="text-xs">Made for creators</p>
        </div>
      </div>
    </footer>
  )
}
