// Flesch-Kincaid Grade Level Calculator

export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1

  // Remove silent e at end
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')

  // Count vowel groups
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function countSentences(text: string): number {
  const matches = text.match(/[.!?]+/g)
  return matches ? matches.length : 1
}

function getWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
}

export function calculateFleschKincaid(text: string): {
  gradeLevel: number
  readingEase: number
  stats: {
    words: number
    sentences: number
    syllables: number
    avgSyllablesPerWord: number
    avgWordsPerSentence: number
  }
} {
  if (!text.trim()) {
    return {
      gradeLevel: 0,
      readingEase: 0,
      stats: {
        words: 0,
        sentences: 0,
        syllables: 0,
        avgSyllablesPerWord: 0,
        avgWordsPerSentence: 0,
      },
    }
  }

  const words = getWords(text)
  const wordCount = words.length
  const sentenceCount = Math.max(countSentences(text), 1)
  const syllableCount = words.reduce(
    (total, word) => total + countSyllables(word),
    0
  )

  const avgSyllablesPerWord = syllableCount / wordCount
  const avgWordsPerSentence = wordCount / sentenceCount

  // Flesch-Kincaid Grade Level formula
  const gradeLevel =
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59

  // Flesch Reading Ease formula
  const readingEase =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord

  return {
    gradeLevel: Math.max(0, Math.round(gradeLevel * 10) / 10),
    readingEase: Math.max(0, Math.min(100, Math.round(readingEase * 10) / 10)),
    stats: {
      words: wordCount,
      sentences: sentenceCount,
      syllables: syllableCount,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    },
  }
}

export function getGradeCategory(gradeLevel: number): {
  category: 'viral' | 'okay' | 'complex'
  label: string
  description: string
  color: string
} {
  if (gradeLevel <= 5) {
    return {
      category: 'viral',
      label: 'Viral Ready',
      description: 'Perfect. A 5th grader can read this.',
      color: 'green',
    }
  }
  if (gradeLevel <= 8) {
    return {
      category: 'okay',
      label: 'Okay',
      description: 'A bit complex. Try shorter sentences.',
      color: 'yellow',
    }
  }
  return {
    category: 'complex',
    label: 'Too Complex',
    description: 'You sound like a textbook. Simplify it.',
    color: 'red',
  }
}
