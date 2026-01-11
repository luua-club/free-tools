'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  calculateFleschKincaid,
  getGradeCategory,
  countSyllables,
} from '@/lib/flesch-kincaid'
import { siteConfig } from '@/config/site'

// Sample text that demonstrates issues
const SAMPLE_TEXT = `The implementation of comprehensive organizational restructuring initiatives necessitates a multifaceted approach to stakeholder engagement and resource optimization.

Furthermore, the utilization of sophisticated analytical methodologies enables the identification of opportunities for operational enhancement.

Companies that prioritize transparency build trust. Simple words win.`

interface SentenceAnalysis {
  text: string
  wordCount: number
  status: 'good' | 'warning' | 'bad'
}

interface WordAnalysis {
  text: string
  syllables: number
  isComplex: boolean
}

function analyzeSentences(text: string): SentenceAnalysis[] {
  if (!text.trim()) return []

  // Split by sentence-ending punctuation
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0)

  return sentences.map((sentence) => {
    const words = sentence
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)
    const wordCount = words.length

    let status: 'good' | 'warning' | 'bad' = 'good'
    if (wordCount > 30) status = 'bad'
    else if (wordCount >= 20) status = 'warning'

    return { text: sentence, wordCount, status }
  })
}

function analyzeWords(text: string): WordAnalysis[] {
  if (!text.trim()) return []

  const words = text.split(/\s+/).filter((w) => w.length > 0)

  return words.map((word) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '')
    const syllables = countSyllables(cleanWord)
    const isComplex = syllables >= 4

    return { text: word, syllables, isComplex }
  })
}

function HighlightedText({ text }: { text: string }) {
  const sentences = useMemo(() => analyzeSentences(text), [text])

  if (!text.trim()) {
    return (
      <div className="text-muted-foreground italic">
        Your text analysis will appear here...
      </div>
    )
  }

  return (
    <div className="space-y-2 leading-relaxed">
      {sentences.map((sentence, i) => {
        const words = analyzeWords(sentence.text)

        const sentenceClass =
          sentence.status === 'bad'
            ? 'bg-red-100 rounded px-1'
            : sentence.status === 'warning'
              ? 'bg-yellow-100 rounded px-1'
              : ''

        return (
          <span key={i} className={sentenceClass}>
            {words.map((word, j) => (
              <span key={j}>
                {word.isComplex ? (
                  <span className="text-red-600 font-semibold underline decoration-red-300 decoration-wavy">
                    {word.text}
                  </span>
                ) : (
                  word.text
                )}
                {j < words.length - 1 ? ' ' : ''}
              </span>
            ))}
            {i < sentences.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </div>
  )
}

function StatCard({
  value,
  label,
  status,
  feedback,
}: {
  value: string | number
  label: string
  status: 'good' | 'warning' | 'bad'
  feedback: string
}) {
  const statusConfig = {
    good: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      feedbackColor: 'text-green-600',
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      feedbackColor: 'text-yellow-600',
    },
    bad: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      feedbackColor: 'text-red-600',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`rounded-xl border p-4 text-center ${config.bg} ${config.border}`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className={`mt-2 text-xs font-medium ${config.feedbackColor}`}>
        {feedback}
      </div>
    </div>
  )
}

function LuuaFixCard({ gradeLevel }: { gradeLevel: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-6"
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 sm:mb-0 sm:mr-4">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Your post is too complex for viral reach</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Grade {gradeLevel} is hard to read. Let Luua AI rewrite it at Grade 5 for maximum engagement.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Button asChild className="gap-2">
            <a href={siteConfig.mainAppUrl} target="_blank" rel="noopener noreferrer">
              <Sparkles className="h-4 w-4" />
              Auto-Fix to Grade 5
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ViralGradePage() {
  const [text, setText] = useState(SAMPLE_TEXT)
  const [copied, setCopied] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(true)

  const result = useMemo(() => calculateFleschKincaid(text), [text])
  const category = useMemo(
    () => getGradeCategory(result.gradeLevel),
    [result.gradeLevel]
  )

  // Calculate issue counts
  const sentences = useMemo(() => analyzeSentences(text), [text])
  const longSentences = sentences.filter((s) => s.status !== 'good').length
  const words = useMemo(() => analyzeWords(text), [text])
  const complexWords = words.filter((w) => w.isComplex).length

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Status helpers
  const getWordsPerSentenceStatus = (
    avg: number
  ): { status: 'good' | 'warning' | 'bad'; feedback: string } => {
    if (avg < 15) return { status: 'good', feedback: 'Perfect length' }
    if (avg <= 20) return { status: 'warning', feedback: 'Slightly long' }
    return { status: 'bad', feedback: 'Too long' }
  }

  const getSyllablesPerWordStatus = (
    avg: number
  ): { status: 'good' | 'warning' | 'bad'; feedback: string } => {
    if (avg < 1.5) return { status: 'good', feedback: 'Simple words' }
    if (avg <= 1.7) return { status: 'warning', feedback: 'Getting complex' }
    return { status: 'bad', feedback: 'Too complex' }
  }

  const scoreColors = {
    viral: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      score: 'text-green-600',
    },
    okay: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      score: 'text-yellow-600',
    },
    complex: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      score: 'text-red-600',
    },
  }

  const colors = result.stats.words > 0 ? scoreColors[category.category] : null
  const wpsStatus = getWordsPerSentenceStatus(result.stats.avgWordsPerSentence)
  const spwStatus = getSyllablesPerWordStatus(result.stats.avgSyllablesPerWord)

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
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Viral Grade Checker
          </h1>
          <p className="mt-2 text-muted-foreground">
            Check if your writing is simple enough to go viral. Like Hemingway App, but for social.
          </p>
        </div>

        {/* Tool UI */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Input Section */}
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium">Your Text</label>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </Button>
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
          </div>
          <Textarea
            placeholder="Paste your text here to check its readability..."
            className="min-h-[150px] resize-none rounded-xl border-border text-base leading-relaxed"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Score Display */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`mt-6 rounded-xl p-6 text-center ${
              colors ? `${colors.bg} ${colors.border} border` : 'bg-muted/50'
            }`}
          >
            <div
              className={`text-6xl font-bold ${
                colors ? colors.score : 'text-muted-foreground'
              }`}
            >
              {result.stats.words > 0 ? result.gradeLevel : '—'}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Grade Level</div>
            {result.stats.words > 0 ? (
              <div className={`mt-4 text-lg font-medium ${colors?.text}`}>
                {category.label}
              </div>
            ) : (
              <div className="mt-4 text-lg font-medium text-muted-foreground">
                Enter text to see your score
              </div>
            )}
            {result.stats.words > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </motion.div>

          {/* Luua Fix Upsell - Only show for complex text (Grade > 8) */}
          {result.stats.words > 0 && result.gradeLevel > 8 && (
            <LuuaFixCard gradeLevel={result.gradeLevel} />
          )}

          {/* Smart Stats */}
          {result.stats.words > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              <StatCard
                value={result.stats.words}
                label="Words"
                status="good"
                feedback={result.stats.words < 50 ? 'Short post' : 'Good length'}
              />
              <StatCard
                value={result.stats.sentences}
                label="Sentences"
                status={longSentences > 0 ? 'warning' : 'good'}
                feedback={
                  longSentences > 0
                    ? `${longSentences} too long`
                    : 'All good'
                }
              />
              <StatCard
                value={result.stats.avgWordsPerSentence}
                label="Words/Sentence"
                status={wpsStatus.status}
                feedback={wpsStatus.feedback}
              />
              <StatCard
                value={result.stats.avgSyllablesPerWord}
                label="Syllables/Word"
                status={spwStatus.status}
                feedback={spwStatus.feedback}
              />
            </motion.div>
          )}

          {/* Visual Analysis Toggle */}
          {result.stats.words > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  {showAnalysis ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Visual Analysis
                  {(longSentences > 0 || complexWords > 0) && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                      {longSentences + complexWords} issues
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {showAnalysis ? 'Hide' : 'Show'}
                </span>
              </button>

              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 rounded-xl border border-border bg-white p-4"
                >
                  {/* Legend */}
                  <div className="mb-4 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="inline-block h-4 w-4 rounded bg-yellow-100" />
                      <span>20-30 word sentence</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block h-4 w-4 rounded bg-red-100" />
                      <span>30+ word sentence</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-600 font-semibold underline decoration-red-300 decoration-wavy">
                        word
                      </span>
                      <span>4+ syllable word</span>
                    </div>
                  </div>

                  {/* Highlighted Text */}
                  <div className="text-sm">
                    <HighlightedText text={text} />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
              <div className="text-sm font-medium text-green-700">Grade 1-5</div>
              <div className="text-xs text-green-600">Viral Ready</div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center">
              <div className="text-sm font-medium text-yellow-700">Grade 6-8</div>
              <div className="text-xs text-yellow-600">Okay</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <div className="text-sm font-medium text-red-700">Grade 9+</div>
              <div className="text-xs text-red-600">Too Complex</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
