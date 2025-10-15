const WORD_BOUNDARY = /\s+/g

const DEFAULT_WORDS_PER_MINUTE = 200

export type ReadingTimeOptions = {
  wordsPerMinute?: number
}

export function estimateReadingTime(text: string, options: ReadingTimeOptions = {}): number | undefined {
  const trimmed = text.trim()

  if (!trimmed) {
    return undefined
  }

  const wordsPerMinute = options.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE
  const wordCount = trimmed.split(WORD_BOUNDARY).filter(Boolean).length

  if (wordCount === 0 || wordsPerMinute <= 0) {
    return undefined
  }

  const minutes = wordCount / wordsPerMinute

  return Math.max(1, Math.round(minutes))
}
