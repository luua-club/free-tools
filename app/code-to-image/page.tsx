'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Download,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Moon,
  Briefcase,
} from 'lucide-react'
import { codeToHtml } from 'shiki'
import { toPng } from 'html-to-image'

import { UpsellBanner } from '@/components/layout/upsell-banner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'bash', label: 'Bash' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
]

const THEMES = [
  { value: 'github-dark', label: 'GitHub Dark', bg: '#0d1117', text: '#c9d1d9' },
  {
    value: 'github-light',
    label: 'GitHub Light',
    bg: '#ffffff',
    text: '#24292f',
  },
  {
    value: 'dracula',
    label: 'Dracula',
    bg: '#282a36',
    text: '#f8f8f2',
  },
  {
    value: 'nord',
    label: 'Nord',
    bg: '#2e3440',
    text: '#d8dee9',
  },
  {
    value: 'one-dark-pro',
    label: 'One Dark Pro',
    bg: '#282c34',
    text: '#abb2bf',
  },
  {
    value: 'vitesse-dark',
    label: 'Vitesse Dark',
    bg: '#121212',
    text: '#dbd7ca',
  },
  {
    value: 'min-light',
    label: 'Min Light',
    bg: '#ffffff',
    text: '#1f1f1f',
  },
]

const BACKGROUNDS = [
  { value: 'gradient-1', label: 'Ocean', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { value: 'gradient-2', label: 'Sunset', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { value: 'gradient-3', label: 'Forest', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { value: 'gradient-4', label: 'Night', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { value: 'gradient-5', label: 'Peach', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { value: 'gradient-6', label: 'Sky', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { value: 'solid-dark', label: 'Dark', gradient: '#1a1a2e' },
  { value: 'solid-light', label: 'Light', gradient: '#f5f5f5' },
  { value: 'transparent', label: 'Transparent', gradient: 'transparent' },
]

const SAMPLE_CODE = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`

// Style Presets
interface StylePreset {
  name: string
  icon: typeof Sparkles
  theme: string
  background: string
  padding: number
  fontSize: number
  showLineNumbers: boolean
  description: string
}

const STYLE_PRESETS: StylePreset[] = [
  {
    name: 'Minimal',
    icon: Sparkles,
    theme: 'min-light',
    background: 'transparent',
    padding: 32,
    fontSize: 14,
    showLineNumbers: false,
    description: 'Clean & simple',
  },
  {
    name: 'Neon',
    icon: Moon,
    theme: 'dracula',
    background: 'gradient-4',
    padding: 48,
    fontSize: 14,
    showLineNumbers: true,
    description: 'Dark & vibrant',
  },
  {
    name: 'Professional',
    icon: Briefcase,
    theme: 'github-dark',
    background: 'solid-dark',
    padding: 40,
    fontSize: 14,
    showLineNumbers: true,
    description: 'Classic look',
  },
]

export default function CodeToImagePage() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('github-dark')
  const [background, setBackground] = useState('gradient-1')
  const [padding, setPadding] = useState(48)
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [windowTitle, setWindowTitle] = useState('untitled.js')
  const [format, setFormat] = useState<'linkedin' | 'twitter'>('linkedin')
  const [highlightedCode, setHighlightedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showWatermark, setShowWatermark] = useState(true)
  const [activePreset, setActivePreset] = useState<string | null>('Professional')
  const previewRef = useRef<HTMLDivElement>(null)

  // Apply preset
  const applyPreset = (preset: StylePreset) => {
    setTheme(preset.theme)
    setBackground(preset.background)
    setPadding(preset.padding)
    setFontSize(preset.fontSize)
    setShowLineNumbers(preset.showLineNumbers)
    setActivePreset(preset.name)
  }

  // Clear active preset when any setting changes manually
  const handleSettingChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value)
    setActivePreset(null)
  }

  const currentTheme = THEMES.find((t) => t.value === theme) || THEMES[0]
  const currentBg = BACKGROUNDS.find((b) => b.value === background) || BACKGROUNDS[0]

  useEffect(() => {
    async function highlight() {
      if (!code.trim()) {
        setHighlightedCode('')
        return
      }
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: theme,
        })
        setHighlightedCode(html)
      } catch {
        // Fallback for unsupported themes
        try {
          const html = await codeToHtml(code, {
            lang: language,
            theme: 'github-dark',
          })
          setHighlightedCode(html)
        } catch {
          setHighlightedCode(`<pre style="color: ${currentTheme.text}">${code}</pre>`)
        }
      }
    }
    highlight()
  }, [code, language, theme, currentTheme.text])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportImage = async () => {
    if (!previewRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        fontEmbedCSS: '', // Skip external font embedding to avoid CORS issues
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        },
      })
      const link = document.createElement('a')
      link.download = `code-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
    setExporting(false)
  }

  const aspectRatio = format === 'linkedin' ? 'aspect-[4/5]' : 'aspect-video'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Code to Image
          </h1>
          <p className="mt-2 text-muted-foreground">
            Turn code snippets into beautiful shareable images.
          </p>
        </div>

        {/* Tool UI */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium">Your Code</label>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {LANGUAGES.find((l) => l.value === language)?.label}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {LANGUAGES.map((lang) => (
                        <DropdownMenuItem
                          key={lang.value}
                          onClick={() => setLanguage(lang.value)}
                        >
                          {lang.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="sm" onClick={copyCode}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Paste your code here..."
                className="min-h-[300px] resize-none rounded-xl border-border font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Settings Panel */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <Label className="text-sm font-medium">Customize</Label>

              {/* Quick Styles */}
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-muted-foreground">Quick Styles</Label>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_PRESETS.map((preset) => {
                    const Icon = preset.icon
                    return (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                          activePreset === preset.name
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${activePreset === preset.name ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-medium">{preset.name}</span>
                        <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Watermark Toggle */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <Label htmlFor="watermark" className="text-xs cursor-pointer">
                  Show Watermark
                </Label>
                <Switch
                  id="watermark"
                  checked={showWatermark}
                  onCheckedChange={setShowWatermark}
                />
              </div>

              {/* Advanced Settings Accordion */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="mt-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <span className="text-xs font-medium">Advanced Settings</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  {/* Theme */}
                  <div className="space-y-2">
                    <Label className="text-xs">Editor Theme</Label>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => handleSettingChange(setTheme)(t.value)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all ${
                            theme === t.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-border"
                            style={{ backgroundColor: t.bg }}
                          />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background */}
                  <div className="space-y-2">
                    <Label className="text-xs">Background</Label>
                    <div className="flex flex-wrap gap-2">
                      {BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.value}
                          onClick={() => handleSettingChange(setBackground)(bg.value)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all ${
                            background === bg.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-border"
                            style={{ background: bg.gradient }}
                          />
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Padding</Label>
                      <span className="text-xs text-muted-foreground">{padding}px</span>
                    </div>
                    <Slider
                      value={[padding]}
                      onValueChange={([v]) => handleSettingChange(setPadding)(v)}
                      min={16}
                      max={96}
                      step={8}
                    />
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Font Size</Label>
                      <span className="text-xs text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([v]) => handleSettingChange(setFontSize)(v)}
                      min={10}
                      max={24}
                      step={1}
                    />
                  </div>

                  {/* Window Title */}
                  <div className="space-y-2">
                    <Label htmlFor="window-title" className="text-xs">
                      Window Title
                    </Label>
                    <Input
                      id="window-title"
                      type="text"
                      value={windowTitle}
                      onChange={(e) => setWindowTitle(e.target.value)}
                      placeholder="untitled.js"
                    />
                  </div>

                  {/* Line Numbers Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers" className="text-xs">
                      Line Numbers
                    </Label>
                    <Switch
                      id="line-numbers"
                      checked={showLineNumbers}
                      onCheckedChange={handleSettingChange(setShowLineNumbers)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={format}
                onValueChange={(v) => setFormat(v as 'linkedin' | 'twitter')}
              >
                <TabsList>
                  <TabsTrigger value="linkedin">LinkedIn (4:5)</TabsTrigger>
                  <TabsTrigger value="twitter">X (16:9)</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={exportImage}
                disabled={exporting || !code.trim()}
              >
                <Download className="mr-2 h-5 w-5" />
                {exporting ? 'Exporting...' : 'Export PNG'}
              </Button>
            </div>

            {/* Preview Canvas */}
            <div
              ref={previewRef}
              className={`${aspectRatio} relative overflow-hidden rounded-xl`}
              style={{
                background: currentBg.gradient,
                padding: `${padding}px`,
              }}
            >
              {code.trim() ? (
                <div
                  className="h-full w-full overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: currentTheme.bg,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 24px -8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* macOS Window Frame */}
                  <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{ backgroundColor: currentTheme.bg }}
                  >
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>
                    {/* Title */}
                    <div className="flex-1 text-center">
                      <span
                        className="text-xs opacity-60"
                        style={{ color: currentTheme.text }}
                      >
                        {windowTitle}
                      </span>
                    </div>
                    {/* Spacer for centering */}
                    <div className="w-[52px]" />
                  </div>

                  {/* Code Content */}
                  <div
                    className="overflow-auto px-4 pb-4"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.6,
                    }}
                  >
                    {showLineNumbers ? (
                      <pre
                        className="font-mono"
                        style={{ color: currentTheme.text }}
                      >
                        {code.split('\n').map((line, i) => (
                          <div key={i} className="flex">
                            <span
                              className="mr-4 select-none text-right opacity-40"
                              style={{ minWidth: '2ch' }}
                            >
                              {i + 1}
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  highlightedCode
                                    .match(/<pre[^>]*>([\s\S]*?)<\/pre>/)?.[1]
                                    ?.split('\n')[i] || line,
                              }}
                            />
                          </div>
                        ))}
                      </pre>
                    ) : (
                      <div
                        className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-white/70">
                  <div>
                    <Code className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-sm">Your code preview will appear here</p>
                  </div>
                </div>
              )}

              {/* Watermark */}
              {showWatermark && (
                <div
                  className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-medium"
                  style={{
                    color: currentBg.value.includes('light') || currentBg.value === 'transparent'
                      ? 'rgba(0, 0, 0, 0.4)'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <span>✨</span>
                  <span>luua.club</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upsell */}
        <div className="mt-8">
          <UpsellBanner />
        </div>
      </motion.div>
    </div>
  )
}
