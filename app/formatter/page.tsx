'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold,
  Copy,
  Check,
  Eye,
  EyeOff,
  Italic,
  Type,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react'

import { UpsellBanner } from '@/components/layout/upsell-banner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  toBold,
  toItalic,
  removeFormatting,
  analyzeWhitespace,
  type XRayAnalysis,
} from '@/lib/unicode-transforms'

// Sample text with formatting hints
// Using the exact Unicode bold characters that toBold() produces (Mathematical Bold)
const SAMPLE_TEXT = `This is a boring hook.

This is a 𝐕𝐢𝐫𝐚𝐥 𝐇𝐨𝐨𝐤 that stops the scroll.

Select any text and press Cmd+B to make it bold.`

// Toast notification component
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Wall of text analysis for X-Ray mode
interface TextBlock {
  startIndex: number
  endIndex: number
  content: string
  charCount: number
  isWallOfText: boolean
}

function analyzeTextBlocks(text: string): TextBlock[] {
  if (!text.trim()) return []

  const blocks: TextBlock[] = []
  const paragraphs = text.split(/\n\n+/)
  let currentIndex = 0

  for (const paragraph of paragraphs) {
    if (paragraph.trim()) {
      const charCount = paragraph.length
      blocks.push({
        startIndex: currentIndex,
        endIndex: currentIndex + paragraph.length,
        content: paragraph,
        charCount,
        isWallOfText: charCount > 300, // ~4 lines worth
      })
    }
    currentIndex += paragraph.length + 2 // +2 for the \n\n
  }

  return blocks
}

export default function FormatterPage() {
  const [text, setText] = useState(SAMPLE_TEXT)
  const [copied, setCopied] = useState(false)
  const [xrayMode, setXrayMode] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const analysis = useMemo<XRayAnalysis>(
    () => analyzeWhitespace(text),
    [text]
  )

  const textBlocks = useMemo(() => analyzeTextBlocks(text), [text])

  // Show toast notification
  const showToast = useCallback((message: string) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2000)
  }, [])

  const applyFormat = useCallback(
    (formatter: (text: string) => string, toastMessage?: string) => {
      const textarea = textareaRef.current
      if (!textarea) return false

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start === end) {
        // No selection - show hint
        return false
      }

      const selectedText = text.slice(start, end)
      const formattedText = formatter(selectedText)
      const newText = text.slice(0, start) + formattedText + text.slice(end)

      setText(newText)

      // Show toast if message provided
      if (toastMessage) {
        showToast(toastMessage)
      }

      // Restore cursor position after the formatted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + formattedText.length)
      }, 0)

      return true
    },
    [text, showToast]
  )

  const handleBold = useCallback((fromShortcut = false) => {
    const success = applyFormat(toBold, fromShortcut ? 'Quick Bold Applied' : undefined)
    return success
  }, [applyFormat])

  const handleItalic = useCallback((fromShortcut = false) => {
    const success = applyFormat(toItalic, fromShortcut ? 'Quick Italic Applied' : undefined)
    return success
  }, [applyFormat])

  const handleRemoveFormat = () => applyFormat(removeFormatting)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if textarea is focused
      if (document.activeElement !== textareaRef.current) return

      // Cmd+B or Ctrl+B for Bold
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        handleBold(true)
      }

      // Cmd+I or Ctrl+I for Italic
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault()
        handleItalic(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleBold, handleItalic])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = text.split('\n')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
            <Type className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Smart Formatter
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add bold, italic formatting and check whitespace density.
          </p>
        </div>

        {/* Tool UI */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleBold(false)}
              title="Cmd+B"
            >
              <Bold className="h-4 w-4" />
              <span className="hidden sm:inline">Bold</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">⌘B</kbd>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleItalic(false)}
              title="Cmd+I"
            >
              <Italic className="h-4 w-4" />
              <span className="hidden sm:inline">Italic</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">⌘I</kbd>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleRemoveFormat}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Remove Format</span>
            </Button>
            <div className="flex-1" />
            <Button
              variant={xrayMode ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setXrayMode(!xrayMode)}
            >
              {xrayMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">X-Ray</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={copyToClipboard}
              disabled={!text}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </Button>
          </div>

          {/* Editor / X-Ray View */}
          <AnimatePresence mode="wait">
            {xrayMode ? (
              <motion.div
                key="xray"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* X-Ray View - Squint Test with Blur */}
                <div className="relative min-h-[300px] rounded-xl border border-border bg-zinc-900 p-4">
                  {text ? (
                    <div className="space-y-4">
                      {textBlocks.map((block, index) => (
                        <div
                          key={index}
                          className={`relative rounded-lg p-3 transition-all ${
                            block.isWallOfText
                              ? 'border-2 border-red-400 bg-red-500/10'
                              : 'border border-zinc-700 bg-zinc-800/50'
                          }`}
                        >
                          {/* Wall of Text Warning Label */}
                          {block.isWallOfText && (
                            <div className="absolute -top-3 left-3 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                              <AlertTriangle className="h-3 w-3" />
                              Wall of Text! Break this up.
                            </div>
                          )}

                          {/* Blurred text for squint test */}
                          <div
                            className={`whitespace-pre-wrap text-sm leading-relaxed ${
                              block.isWallOfText ? 'text-red-200' : 'text-zinc-300'
                            } blur-[2px]`}
                          >
                            {block.content}
                          </div>

                          {/* Character count badge */}
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className={block.isWallOfText ? 'text-red-400' : 'text-zinc-500'}>
                              {block.charCount} chars
                            </span>
                            {block.isWallOfText && (
                              <span className="text-red-400">
                                {Math.ceil(block.charCount / 75)} lines (max 4)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[268px] items-center justify-center text-zinc-500">
                      <div className="text-center">
                        <Eye className="mx-auto mb-2 h-8 w-8" />
                        <p>Enter text to analyze whitespace</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* X-Ray Analysis Panel */}
                {text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid gap-4 sm:grid-cols-2"
                  >
                    {/* Stats */}
                    <div className="rounded-xl bg-muted/50 p-4">
                      <h4 className="mb-3 font-medium">Whitespace Stats</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-background p-2 text-center">
                          <div className="text-lg font-semibold">
                            {analysis.totalLines}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Lines
                          </div>
                        </div>
                        <div className="rounded-lg bg-background p-2 text-center">
                          <div className="text-lg font-semibold">
                            {analysis.emptyLines}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Empty Lines
                          </div>
                        </div>
                        <div className="rounded-lg bg-background p-2 text-center">
                          <div className="text-lg font-semibold">
                            {analysis.textBlocks.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Text Blocks
                          </div>
                        </div>
                        <div className="rounded-lg bg-background p-2 text-center">
                          <div className="text-lg font-semibold">
                            {Math.round(analysis.whitespaceRatio * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Whitespace
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="rounded-xl bg-muted/50 p-4">
                      <h4 className="mb-3 font-medium">Suggestions</h4>
                      {analysis.suggestions.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.suggestions.map((suggestion, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                              <span className="text-muted-foreground">
                                {suggestion}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          Whitespace looks good!
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded bg-red-500/20" />
                    Wall of text (4+ lines)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block text-zinc-600">⎯</span>
                    Empty line
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  ref={textareaRef}
                  placeholder="Type or paste your text here. Select text to apply formatting..."
                  className="min-h-[300px] resize-none rounded-xl border-border text-base leading-relaxed"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                {/* Stats */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>{text.length} characters</span>
                  <span>{lines.length} lines</span>
                  {analysis.hasWallOfText && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      Wall of text detected
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="mt-4 rounded-xl bg-muted/50 p-4">
            <h3 className="font-medium">💡 Viral Formatting Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">→</span>
                <span>Don&apos;t Bold whole sentences. Just <strong className="text-foreground">keywords</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">→</span>
                <span>Keep paragraphs under 3 lines to improve <strong className="text-foreground">Scannability</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">→</span>
                <span>Use Italics for <em className="text-foreground">emphasis</em> or internal monologue.</span>
              </li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1">⌘B Bold</span>
              <span className="rounded bg-muted px-2 py-1">⌘I Italic</span>
            </div>
          </div>
        </div>

        {/* Upsell */}
        <div className="mt-8">
          <UpsellBanner
            message={
              textBlocks.some(b => b.isWallOfText)
                ? 'Wall of text detected! Luua AI can optimize your formatting.'
                : undefined
            }
          />
        </div>
      </motion.div>

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} />
    </div>
  )
}
