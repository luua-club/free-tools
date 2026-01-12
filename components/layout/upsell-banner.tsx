'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface UpsellBannerProps {
  variant?: 'inline' | 'floating'
  message?: string
  className?: string
}

export function UpsellBanner({
  variant = 'inline',
  message = "Don't want to fix this manually? Luua writes viral posts for you.",
  className,
}: UpsellBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl',
          className
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
          {/* Gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <p className="flex-1 text-sm font-medium">{message}</p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <a href={siteConfig.mainAppUrl}>
                  Try Luua
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4',
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-primary/5 blur-xl" />

      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">
              AI-powered content creation for social media
            </p>
          </div>
        </div>

        <Button
          size="sm"
          asChild
          className="group w-full bg-primary hover:bg-primary/90 sm:w-auto"
        >
          <a href="https://luua.club" target="_blank">
            Try Luua Free
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
