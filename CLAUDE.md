# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luua Tools is a suite of 4 client-side marketing tools for social media creators. All logic runs in the browser (zero backend).

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Components**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Package Manager**: pnpm

### Tool-Specific Libraries
- **Post Previewer**: TipTap + runes2 (Unicode char counting)
- **Viral Grade**: Custom Flesch-Kincaid implementation
- **Code to Image**: Shiki + html-to-image
- **Smart Formatter**: TipTap + Unicode transforms

## Development Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

## Architecture

### Route Structure
```
app/
├── page.tsx              # Tools directory page
├── preview/page.tsx      # Post Previewer tool
├── viral-grade/page.tsx  # Readability checker
├── code-to-image/page.tsx # Code screenshot tool
├── formatter/page.tsx    # Smart text formatter
└── layout.tsx            # Root layout with Header/Footer
```

### Shared Components
```
components/
├── layout/
│   ├── header.tsx        # Sticky nav with tool links
│   ├── footer.tsx        # Footer with tool grid
│   └── upsell-banner.tsx # Contextual CTA banner
└── ui/                   # shadcn/ui components
```

## Design System

- **Primary**: Luua Gold `#f0c505`
- **Typography**: Lexend (headlines) + Inter (body)
- **Background**: White with gold accents `#fef9e7`
- **Border radius**: 0.75rem (12px)

## Key Patterns

- All tool pages use `'use client'` for Framer Motion animations
- Shared config in `config/site.ts` for tool metadata and URLs
- UpsellBanner component shows contextual CTAs based on tool state
- CSS variables defined in `globals.css` for theming
