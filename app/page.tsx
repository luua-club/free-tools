'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { faqsConfig } from '@/config/site'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4 text-muted-foreground"
        >
          {answer}
        </motion.div>
      )}
    </div>
  )
}

// Mini UI Components for Bento Cards
function PostPreviewerGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      {/* Phone Frame */}
      <div className="relative rounded-2xl border-4 border-zinc-800 bg-white p-3 shadow-xl">
        {/* Status Bar */}
        <div className="mb-2 flex items-center justify-between text-[10px] text-zinc-400">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-zinc-300" />
            <div className="h-2 w-2 rounded-full bg-zinc-300" />
          </div>
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
            <div>
              <div className="h-2 w-16 rounded bg-zinc-200" />
              <div className="mt-1 h-1.5 w-12 rounded bg-zinc-100" />
            </div>
          </div>

          {/* Text Lines */}
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-zinc-200" />
            <div className="h-2 w-full rounded bg-zinc-200" />
            <div className="h-2 w-3/4 rounded bg-zinc-200" />
          </div>

          {/* Cutoff Line */}
          <div className="relative my-2">
            <div className="absolute inset-x-0 border-t-2 border-dashed border-red-400" />
            <span className="relative -top-2 bg-white px-1 text-[9px] font-medium text-red-500">
              see more cutoff
            </span>
          </div>

          {/* Hidden Content */}
          <div className="space-y-1.5 opacity-30">
            <div className="h-2 w-full rounded bg-zinc-200" />
            <div className="h-2 w-2/3 rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ViralGradeGraphic() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        <div className="text-7xl font-bold text-green-500">A+</div>
        <div className="absolute -right-2 -top-2 h-4 w-4 animate-pulse rounded-full bg-green-400" />
      </div>
    </div>
  )
}

function CodeToImageGraphic() {
  return (
    <div className="overflow-hidden rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-3 font-mono text-[10px] text-white shadow-lg">
      <div className="mb-2 flex gap-1.5">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-yellow-400" />
        <div className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <div className="space-y-1 opacity-90">
        <div><span className="text-pink-300">const</span> <span className="text-blue-300">greeting</span> = <span className="text-amber-300">&quot;Hello&quot;</span>;</div>
        <div><span className="text-pink-300">function</span> <span className="text-green-300">wave</span>() {"{"}</div>
        <div className="pl-3"><span className="text-blue-300">console</span>.<span className="text-yellow-300">log</span>(greeting);</div>
        <div>{"}"}</div>
      </div>
    </div>
  )
}

function SmartFormatterGraphic() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="text-center">
        <div className="text-lg text-zinc-400">plain text</div>
        <div className="mt-1 text-xs text-zinc-300">before</div>
      </div>
      <ArrowRight className="h-5 w-5 text-zinc-300" />
      <div className="text-center">
        <div className="text-lg font-bold text-zinc-800">𝗯𝗼𝗹𝗱 𝘁𝗲𝘅𝘁</div>
        <div className="mt-1 text-xs text-zinc-500">after</div>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Free Social Media Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Preview your posts, check readability, create code screenshots, and format text.
          All tools run in your browser - no sign-up, no data collection.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Hero Card - Post Previewer (spans 2 cols) */}
        <motion.div variants={itemVariants} className="sm:col-span-2">
          <Link
            href="/preview"
            className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Post Previewer</h2>
              <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600" />
            </div>

            <div className="flex-1">
              <PostPreviewerGraphic />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              See exactly where LinkedIn cuts off your hook. Height-based truncation preview.
            </p>
          </Link>
        </motion.div>

        {/* Viral Grade (square) */}
        <motion.div variants={itemVariants}>
          <Link
            href="/viral-grade"
            className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Viral Grade</h2>
              <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600" />
            </div>

            <div className="flex-1">
              <ViralGradeGraphic />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Check if your writing is simple enough to go viral.
            </p>
          </Link>
        </motion.div>

        {/* Code to Image (square) */}
        <motion.div variants={itemVariants}>
          <Link
            href="/code-to-image"
            className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Code to Image</h2>
              <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600" />
            </div>

            <div className="flex-1 flex items-center justify-center">
              <CodeToImageGraphic />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Turn code snippets into beautiful shareable images.
            </p>
          </Link>
        </motion.div>

        {/* Smart Formatter (spans 2 cols) */}
        <motion.div variants={itemVariants} className="sm:col-span-2">
          <Link
            href="/formatter"
            className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Smart Formatter</h2>
              <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600" />
            </div>

            <div className="flex-1 flex items-center justify-center">
              <SmartFormatterGraphic />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Add Unicode bold & italic formatting. Analyze whitespace density.
            </p>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-20"
      >
        <h2 className="mb-8 text-center text-2xl font-bold">Why Use Luua Tools?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-semibold">100% Free</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No sign-up, no credit card, no limits. Use all tools as much as you want.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold">Privacy First</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything runs in your browser. Your content never leaves your device.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold">Built for Creators</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Designed specifically for LinkedIn and X/Twitter content creators.
            </p>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20"
      >
        <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          {faqsConfig.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}
