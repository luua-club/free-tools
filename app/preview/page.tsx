'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Eye, Copy, Check, Info, Pencil } from 'lucide-react'
import { LinkedInIcon, XIcon } from '@/components/icons/social'
import runes from 'runes2'

import { UpsellBanner } from '@/components/layout/upsell-banner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

// Sample text that demonstrates the cutoff - triggers "see more" on mobile
const SAMPLE_TEXT = `I just mass-applied to 500 jobs.

Here's what happened:

0 interviews.
0 callbacks.
0 responses.

Then I changed ONE thing on my resume...

And got 12 interviews in 2 weeks.

The secret? I stopped listing responsibilities.

I started showing IMPACT.

Here's the exact formula I used:`

// LinkedIn truncates based on visual height, not character count
const LINE_LIMITS = {
  linkedinMobile: 5,
  linkedinDesktop: 7,
  twitter: 280,
}

const CHARS_PER_LINE = {
  linkedinMobile: 45,
  linkedinDesktop: 70,
}

// Avatar color options
const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
]

interface LineAnalysis {
  totalVisualLines: number
  visibleText: string
  hiddenText: string
  isOverLimit: boolean
  visibleLines: number
}

function analyzeLines(
  text: string,
  maxLines: number,
  charsPerLine: number
): LineAnalysis {
  if (!text) {
    return {
      totalVisualLines: 0,
      visibleText: '',
      hiddenText: '',
      isOverLimit: false,
      visibleLines: 0,
    }
  }

  const paragraphs = text.split('\n')
  let visualLineCount = 0
  let visibleText = ''
  let hiddenText = ''
  let isOverLimit = false
  let cutoffReached = false

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]

    if (paragraph === '') {
      visualLineCount += 1
      if (!cutoffReached) {
        if (visualLineCount <= maxLines) {
          visibleText += '\n'
        } else {
          cutoffReached = true
          isOverLimit = true
          hiddenText += '\n'
        }
      } else {
        hiddenText += '\n'
      }
      continue
    }

    const paragraphChars = runes(paragraph).length
    const wrappedLines = Math.ceil(paragraphChars / charsPerLine)

    if (!cutoffReached) {
      const linesRemaining = maxLines - visualLineCount

      if (wrappedLines <= linesRemaining) {
        visibleText += (visibleText && !visibleText.endsWith('\n') ? '\n' : '') + paragraph
        visualLineCount += wrappedLines
      } else {
        cutoffReached = true
        isOverLimit = true

        if (linesRemaining > 0) {
          const charsToShow = linesRemaining * charsPerLine
          const visiblePart = runes(paragraph).slice(0, charsToShow).join('')
          const hiddenPart = runes(paragraph).slice(charsToShow).join('')
          visibleText += (visibleText && !visibleText.endsWith('\n') ? '\n' : '') + visiblePart
          hiddenText = hiddenPart
        } else {
          hiddenText = paragraph
        }
        visualLineCount += wrappedLines
      }
    } else {
      hiddenText += (hiddenText && !hiddenText.endsWith('\n') ? '\n' : '') + paragraph
      visualLineCount += wrappedLines
    }
  }

  return {
    totalVisualLines: visualLineCount,
    visibleText: visibleText.trim(),
    hiddenText: hiddenText.trim(),
    isOverLimit,
    visibleLines: Math.min(visualLineCount, maxLines),
  }
}

function getLineStatus(analysis: LineAnalysis, maxLines: number) {
  if (analysis.totalVisualLines === 0) {
    return { status: 'empty', message: 'Start typing...' }
  }
  if (analysis.totalVisualLines <= maxLines * 0.6) {
    return { status: 'safe', message: 'Hook fully visible' }
  }
  if (analysis.totalVisualLines <= maxLines) {
    return { status: 'warning', message: 'Getting close to fold' }
  }
  return { status: 'danger', message: 'Content hidden behind "see more"' }
}

function getTwitterStatus(charCount: number) {
  if (charCount === 0) return { status: 'empty', message: 'Start typing...' }
  if (charCount <= 200) return { status: 'safe', message: 'Good length' }
  if (charCount <= 280) return { status: 'warning', message: 'Getting close' }
  return { status: 'danger', message: 'Over limit!' }
}

export default function PreviewPage() {
  const [text, setText] = useState(SAMPLE_TEXT)
  const [copied, setCopied] = useState(false)
  const [profileName, setProfileName] = useState('Your Name')
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const charCount = runes(text).length
  const lineCount = text.split('\n').length

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Post Previewer
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how your post will look on LinkedIn and X before publishing.
          </p>
        </div>

        {/* Tool UI */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium">Your Post</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!text}
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <Textarea
              placeholder="Write your post here... Start with a strong hook!"
              className="min-h-[300px] resize-none rounded-xl border-border text-base leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {charCount} characters • {lineCount} line
                {lineCount !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setText('')}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <Tabs defaultValue="linkedin-mobile" className="w-full">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="linkedin-mobile" className="flex-1 gap-2">
                  <LinkedInIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </TabsTrigger>
                <TabsTrigger value="linkedin-desktop" className="flex-1 gap-2">
                  <LinkedInIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </TabsTrigger>
                <TabsTrigger value="twitter" className="flex-1 gap-2">
                  <XIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">/ Twitter</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="linkedin-mobile">
                <LinkedInPreviewCard
                  text={text}
                  maxLines={LINE_LIMITS.linkedinMobile}
                  charsPerLine={CHARS_PER_LINE.linkedinMobile}
                  variant="mobile"
                  profileName={profileName}
                  avatarColor={avatarColor}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  setProfileName={setProfileName}
                  setAvatarColor={setAvatarColor}
                />
              </TabsContent>

              <TabsContent value="linkedin-desktop">
                <LinkedInPreviewCard
                  text={text}
                  maxLines={LINE_LIMITS.linkedinDesktop}
                  charsPerLine={CHARS_PER_LINE.linkedinDesktop}
                  variant="desktop"
                  profileName={profileName}
                  avatarColor={avatarColor}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  setProfileName={setProfileName}
                  setAvatarColor={setAvatarColor}
                />
              </TabsContent>

              <TabsContent value="twitter">
                <TwitterPreviewCard
                  text={text}
                  profileName={profileName}
                  avatarColor={avatarColor}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  setProfileName={setProfileName}
                  setAvatarColor={setAvatarColor}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-xl bg-muted/50 p-4">
          <h3 className="font-medium">How LinkedIn truncation works</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            LinkedIn shows &quot;see more&quot; based on <strong>visual height</strong>, not character count.
            More line breaks = less visible text. Mobile shows ~5 lines, desktop ~7 lines before truncation.
          </p>
        </div>

        {/* Upsell */}
        <div className="mt-8">
          <UpsellBanner />
        </div>
      </motion.div>
    </div>
  )
}

function LinkedInPreviewCard({
  text,
  maxLines,
  charsPerLine,
  variant,
  profileName,
  avatarColor,
  isEditingProfile,
  setIsEditingProfile,
  setProfileName,
  setAvatarColor,
}: {
  text: string
  maxLines: number
  charsPerLine: number
  variant: 'mobile' | 'desktop'
  profileName: string
  avatarColor: string
  isEditingProfile: boolean
  setIsEditingProfile: (v: boolean) => void
  setProfileName: (v: string) => void
  setAvatarColor: (v: string) => void
}) {
  const analysis = useMemo(
    () => analyzeLines(text, maxLines, charsPerLine),
    [text, maxLines, charsPerLine]
  )
  const status = getLineStatus(analysis, maxLines)

  const statusColors = {
    empty: 'text-muted-foreground',
    safe: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  return (
    <div className="space-y-4">
      {/* Status indicator with tooltip */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {analysis.totalVisualLines} visual line{analysis.totalVisualLines !== 1 ? 's' : ''} • {maxLines} visible
          </span>
          <div className="group relative">
            <Info className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg z-10">
              LinkedIn counts pixels, not characters. We calculate exact visual height to predict where &quot;see more&quot; appears.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
            </div>
          </div>
        </div>
        <span
          className={`text-sm font-medium ${statusColors[status.status as keyof typeof statusColors]}`}
        >
          {status.message}
        </span>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-border bg-white p-4">
        {/* Profile header */}
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarColor} cursor-pointer`}
            onClick={() => setIsEditingProfile(true)}
          />
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="space-y-2">
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="h-7 text-sm font-semibold"
                  placeholder="Your name"
                  onBlur={() => setIsEditingProfile(false)}
                  autoFocus
                />
                <div className="flex gap-1">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`h-5 w-5 rounded-full bg-gradient-to-br ${color} ${
                        avatarColor === color ? 'ring-2 ring-offset-1 ring-zinc-400' : ''
                      }`}
                      onClick={() => setAvatarColor(color)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="group cursor-pointer"
                onClick={() => setIsEditingProfile(true)}
              >
                <div className="flex items-center gap-1 font-semibold">
                  {profileName}
                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Your headline • 1h
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post content */}
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
          <span>{analysis.visibleText}</span>
          {analysis.isOverLimit && (
            <>
              <span className="text-blue-600 cursor-pointer">
                ...see more
              </span>
              <div className="mt-3 rounded bg-red-50 p-3 text-xs">
                <div className="font-medium text-red-700 mb-1">
                  Hidden behind &quot;see more&quot; ({analysis.totalVisualLines - maxLines} lines):
                </div>
                <div className="text-red-600/80 whitespace-pre-wrap">
                  {analysis.hiddenText}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TwitterPreviewCard({
  text,
  profileName,
  avatarColor,
  isEditingProfile,
  setIsEditingProfile,
  setProfileName,
  setAvatarColor,
}: {
  text: string
  profileName: string
  avatarColor: string
  isEditingProfile: boolean
  setIsEditingProfile: (v: boolean) => void
  setProfileName: (v: string) => void
  setAvatarColor: (v: string) => void
}) {
  const charCount = runes(text).length
  const status = getTwitterStatus(charCount)
  const isOverLimit = charCount > 280

  const statusColors = {
    empty: 'text-muted-foreground',
    safe: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
        <span className="text-sm text-muted-foreground">
          {charCount} / 280 characters
        </span>
        <span
          className={`text-sm font-medium ${statusColors[status.status as keyof typeof statusColors]}`}
        >
          {status.message}
        </span>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-border bg-white p-4">
        {/* Profile header */}
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarColor} cursor-pointer`}
            onClick={() => setIsEditingProfile(true)}
          />
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="space-y-2">
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="h-7 text-sm font-semibold"
                  placeholder="Your name"
                  onBlur={() => setIsEditingProfile(false)}
                  autoFocus
                />
                <div className="flex gap-1">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`h-5 w-5 rounded-full bg-gradient-to-br ${color} ${
                        avatarColor === color ? 'ring-2 ring-offset-1 ring-zinc-400' : ''
                      }`}
                      onClick={() => setAvatarColor(color)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="group cursor-pointer"
                onClick={() => setIsEditingProfile(true)}
              >
                <div className="flex items-center gap-1 font-semibold">
                  {profileName}
                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground">
                  @{profileName.toLowerCase().replace(/\s+/g, '')} • 1h
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post content */}
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
          <span>{isOverLimit ? runes(text).slice(0, 280).join('') : text}</span>
          {isOverLimit && (
            <div className="mt-3 rounded bg-red-50 p-3 text-xs">
              <div className="font-medium text-red-700 mb-1">
                Over limit by {charCount - 280} characters:
              </div>
              <div className="text-red-600/80">
                {runes(text).slice(280).join('')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
