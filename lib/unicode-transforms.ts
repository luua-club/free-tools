// Unicode Bold and Italic Text Transformations
// These use mathematical alphanumeric symbols to create bold/italic text
// that works on platforms without rich text support (LinkedIn, X, etc.)

// Unicode Mathematical Bold (U+1D400 - U+1D433)
const BOLD_MAP: Record<string, string> = {
  A: '\u{1D400}',
  B: '\u{1D401}',
  C: '\u{1D402}',
  D: '\u{1D403}',
  E: '\u{1D404}',
  F: '\u{1D405}',
  G: '\u{1D406}',
  H: '\u{1D407}',
  I: '\u{1D408}',
  J: '\u{1D409}',
  K: '\u{1D40A}',
  L: '\u{1D40B}',
  M: '\u{1D40C}',
  N: '\u{1D40D}',
  O: '\u{1D40E}',
  P: '\u{1D40F}',
  Q: '\u{1D410}',
  R: '\u{1D411}',
  S: '\u{1D412}',
  T: '\u{1D413}',
  U: '\u{1D414}',
  V: '\u{1D415}',
  W: '\u{1D416}',
  X: '\u{1D417}',
  Y: '\u{1D418}',
  Z: '\u{1D419}',
  a: '\u{1D41A}',
  b: '\u{1D41B}',
  c: '\u{1D41C}',
  d: '\u{1D41D}',
  e: '\u{1D41E}',
  f: '\u{1D41F}',
  g: '\u{1D420}',
  h: '\u{1D421}',
  i: '\u{1D422}',
  j: '\u{1D423}',
  k: '\u{1D424}',
  l: '\u{1D425}',
  m: '\u{1D426}',
  n: '\u{1D427}',
  o: '\u{1D428}',
  p: '\u{1D429}',
  q: '\u{1D42A}',
  r: '\u{1D42B}',
  s: '\u{1D42C}',
  t: '\u{1D42D}',
  u: '\u{1D42E}',
  v: '\u{1D42F}',
  w: '\u{1D430}',
  x: '\u{1D431}',
  y: '\u{1D432}',
  z: '\u{1D433}',
  // Bold digits (U+1D7CE - U+1D7D7)
  '0': '\u{1D7CE}',
  '1': '\u{1D7CF}',
  '2': '\u{1D7D0}',
  '3': '\u{1D7D1}',
  '4': '\u{1D7D2}',
  '5': '\u{1D7D3}',
  '6': '\u{1D7D4}',
  '7': '\u{1D7D5}',
  '8': '\u{1D7D6}',
  '9': '\u{1D7D7}',
}

// Unicode Mathematical Italic (U+1D434 - U+1D467)
const ITALIC_MAP: Record<string, string> = {
  A: '\u{1D434}',
  B: '\u{1D435}',
  C: '\u{1D436}',
  D: '\u{1D437}',
  E: '\u{1D438}',
  F: '\u{1D439}',
  G: '\u{1D43A}',
  H: '\u{1D43B}',
  I: '\u{1D43C}',
  J: '\u{1D43D}',
  K: '\u{1D43E}',
  L: '\u{1D43F}',
  M: '\u{1D440}',
  N: '\u{1D441}',
  O: '\u{1D442}',
  P: '\u{1D443}',
  Q: '\u{1D444}',
  R: '\u{1D445}',
  S: '\u{1D446}',
  T: '\u{1D447}',
  U: '\u{1D448}',
  V: '\u{1D449}',
  W: '\u{1D44A}',
  X: '\u{1D44B}',
  Y: '\u{1D44C}',
  Z: '\u{1D44D}',
  a: '\u{1D44E}',
  b: '\u{1D44F}',
  c: '\u{1D450}',
  d: '\u{1D451}',
  e: '\u{1D452}',
  f: '\u{1D453}',
  g: '\u{1D454}',
  h: '\u{210E}', // Special case - uses planck constant
  i: '\u{1D456}',
  j: '\u{1D457}',
  k: '\u{1D458}',
  l: '\u{1D459}',
  m: '\u{1D45A}',
  n: '\u{1D45B}',
  o: '\u{1D45C}',
  p: '\u{1D45D}',
  q: '\u{1D45E}',
  r: '\u{1D45F}',
  s: '\u{1D460}',
  t: '\u{1D461}',
  u: '\u{1D462}',
  v: '\u{1D463}',
  w: '\u{1D464}',
  x: '\u{1D465}',
  y: '\u{1D466}',
  z: '\u{1D467}',
}

// Unicode Mathematical Bold Italic (U+1D468 - U+1D49B)
const BOLD_ITALIC_MAP: Record<string, string> = {
  A: '\u{1D468}',
  B: '\u{1D469}',
  C: '\u{1D46A}',
  D: '\u{1D46B}',
  E: '\u{1D46C}',
  F: '\u{1D46D}',
  G: '\u{1D46E}',
  H: '\u{1D46F}',
  I: '\u{1D470}',
  J: '\u{1D471}',
  K: '\u{1D472}',
  L: '\u{1D473}',
  M: '\u{1D474}',
  N: '\u{1D475}',
  O: '\u{1D476}',
  P: '\u{1D477}',
  Q: '\u{1D478}',
  R: '\u{1D479}',
  S: '\u{1D47A}',
  T: '\u{1D47B}',
  U: '\u{1D47C}',
  V: '\u{1D47D}',
  W: '\u{1D47E}',
  X: '\u{1D47F}',
  Y: '\u{1D480}',
  Z: '\u{1D481}',
  a: '\u{1D482}',
  b: '\u{1D483}',
  c: '\u{1D484}',
  d: '\u{1D485}',
  e: '\u{1D486}',
  f: '\u{1D487}',
  g: '\u{1D488}',
  h: '\u{1D489}',
  i: '\u{1D48A}',
  j: '\u{1D48B}',
  k: '\u{1D48C}',
  l: '\u{1D48D}',
  m: '\u{1D48E}',
  n: '\u{1D48F}',
  o: '\u{1D490}',
  p: '\u{1D491}',
  q: '\u{1D492}',
  r: '\u{1D493}',
  s: '\u{1D494}',
  t: '\u{1D495}',
  u: '\u{1D496}',
  v: '\u{1D497}',
  w: '\u{1D498}',
  x: '\u{1D499}',
  y: '\u{1D49A}',
  z: '\u{1D49B}',
}

// Create reverse maps for detecting formatted text
const REVERSE_BOLD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BOLD_MAP).map(([k, v]) => [v, k])
)

const REVERSE_ITALIC_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ITALIC_MAP).map(([k, v]) => [v, k])
)

const REVERSE_BOLD_ITALIC_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BOLD_ITALIC_MAP).map(([k, v]) => [v, k])
)

/**
 * Convert text to Unicode bold
 */
export function toBold(text: string): string {
  return [...text].map((char) => BOLD_MAP[char] || char).join('')
}

/**
 * Convert text to Unicode italic
 */
export function toItalic(text: string): string {
  return [...text].map((char) => ITALIC_MAP[char] || char).join('')
}

/**
 * Convert text to Unicode bold italic
 */
export function toBoldItalic(text: string): string {
  return [...text].map((char) => BOLD_ITALIC_MAP[char] || char).join('')
}

/**
 * Remove Unicode formatting (bold, italic, bold-italic) from text
 */
export function removeFormatting(text: string): string {
  return [...text]
    .map((char) => {
      return (
        REVERSE_BOLD_MAP[char] ||
        REVERSE_ITALIC_MAP[char] ||
        REVERSE_BOLD_ITALIC_MAP[char] ||
        char
      )
    })
    .join('')
}

/**
 * Check if a character is a Unicode bold character
 */
export function isBoldChar(char: string): boolean {
  return char in REVERSE_BOLD_MAP
}

/**
 * Check if a character is a Unicode italic character
 */
export function isItalicChar(char: string): boolean {
  return char in REVERSE_ITALIC_MAP
}

/**
 * Check if a character is a Unicode bold italic character
 */
export function isBoldItalicChar(char: string): boolean {
  return char in REVERSE_BOLD_ITALIC_MAP
}

/**
 * Analyze text for whitespace issues (X-Ray analysis)
 */
export interface XRayAnalysis {
  totalLines: number
  emptyLines: number
  textBlocks: TextBlock[]
  whitespaceRatio: number
  hasWallOfText: boolean
  suggestions: string[]
}

export interface TextBlock {
  startLine: number
  endLine: number
  lineCount: number
  isWallOfText: boolean
}

export function analyzeWhitespace(text: string): XRayAnalysis {
  const lines = text.split('\n')
  const totalLines = lines.length
  const emptyLines = lines.filter((line) => line.trim() === '').length
  const whitespaceRatio = totalLines > 0 ? emptyLines / totalLines : 0

  // Find consecutive text blocks
  const textBlocks: TextBlock[] = []
  let currentBlockStart: number | null = null

  lines.forEach((line, index) => {
    const isEmpty = line.trim() === ''

    if (!isEmpty && currentBlockStart === null) {
      currentBlockStart = index
    } else if (isEmpty && currentBlockStart !== null) {
      const lineCount = index - currentBlockStart
      textBlocks.push({
        startLine: currentBlockStart,
        endLine: index - 1,
        lineCount,
        isWallOfText: lineCount > 4,
      })
      currentBlockStart = null
    }
  })

  // Handle final block
  if (currentBlockStart !== null) {
    const lineCount = lines.length - currentBlockStart
    textBlocks.push({
      startLine: currentBlockStart,
      endLine: lines.length - 1,
      lineCount,
      isWallOfText: lineCount > 4,
    })
  }

  const hasWallOfText = textBlocks.some((block) => block.isWallOfText)

  // Generate suggestions
  const suggestions: string[] = []

  if (hasWallOfText) {
    suggestions.push('Break up long text blocks with empty lines')
  }

  if (whitespaceRatio < 0.15 && totalLines > 5) {
    suggestions.push('Add more whitespace for better readability')
  }

  if (whitespaceRatio > 0.5) {
    suggestions.push('Consider reducing excessive whitespace')
  }

  if (textBlocks.length === 1 && totalLines > 3) {
    suggestions.push('Use shorter paragraphs for social media')
  }

  return {
    totalLines,
    emptyLines,
    textBlocks,
    whitespaceRatio,
    hasWallOfText,
    suggestions,
  }
}
