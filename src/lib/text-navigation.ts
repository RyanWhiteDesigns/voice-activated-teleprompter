import type { TextElement } from "./word-tokenizer"

const isSentenceBoundary = (value: string) => /[.!?…]/.test(value) || /\n/.test(value)

const isParagraphBoundary = (value: string) => /\n\s*\n/.test(value)

const findFirstTokenIndex = (elements: TextElement[]) => {
  const token = elements.find(element => element.type === "TOKEN")
  return token?.index ?? -1
}

const findNextTokenAfter = (elements: TextElement[], index: number) => {
  const token = elements.find(
    element => element.type === "TOKEN" && element.index > index,
  )
  return token?.index ?? -1
}

const findPreviousTokenBefore = (elements: TextElement[], index: number) => {
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    const element = elements[i]
    if (element.type === "TOKEN" && element.index < index) {
      return element.index
    }
  }

  return -1
}

export const findSentenceStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  const firstTokenIndex = findFirstTokenIndex(elements)

  if (currentIndex < 0 || firstTokenIndex < 0) {
    return firstTokenIndex
  }

  let sentenceStart = firstTokenIndex

  for (const element of elements) {
    if (element.index > currentIndex) {
      break
    }

    if (element.type === "DELIMITER" && isSentenceBoundary(element.value)) {
      const nextTokenIndex = findNextTokenAfter(elements, element.index)
      if (nextTokenIndex >= 0 && nextTokenIndex <= currentIndex) {
        sentenceStart = nextTokenIndex
      }
    }
  }

  return sentenceStart
}

export const findPreviousSentenceStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  const currentSentenceStart = findSentenceStart(elements, currentIndex)
  const previousTokenIndex = findPreviousTokenBefore(elements, currentSentenceStart)

  if (previousTokenIndex < 0) {
    return currentSentenceStart
  }

  return findSentenceStart(elements, previousTokenIndex)
}

export const findNextSentenceStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  if (currentIndex < 0) {
    return findFirstTokenIndex(elements)
  }

  for (const element of elements) {
    if (element.index <= currentIndex) {
      continue
    }

    if (element.type === "DELIMITER" && isSentenceBoundary(element.value)) {
      const nextTokenIndex = findNextTokenAfter(elements, element.index)
      if (nextTokenIndex >= 0) {
        return nextTokenIndex
      }
    }
  }

  return currentIndex
}

export const findParagraphStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  const firstTokenIndex = findFirstTokenIndex(elements)

  if (currentIndex < 0 || firstTokenIndex < 0) {
    return firstTokenIndex
  }

  let paragraphStart = firstTokenIndex

  for (const element of elements) {
    if (element.index > currentIndex) {
      break
    }

    if (element.type === "DELIMITER" && isParagraphBoundary(element.value)) {
      const nextTokenIndex = findNextTokenAfter(elements, element.index)
      if (nextTokenIndex >= 0 && nextTokenIndex <= currentIndex) {
        paragraphStart = nextTokenIndex
      }
    }
  }

  return paragraphStart
}

export const findPreviousParagraphStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  const currentParagraphStart = findParagraphStart(elements, currentIndex)
  const previousTokenIndex = findPreviousTokenBefore(elements, currentParagraphStart)

  if (previousTokenIndex < 0) {
    return currentParagraphStart
  }

  return findParagraphStart(elements, previousTokenIndex)
}

export const findNextParagraphStart = (
  elements: TextElement[],
  currentIndex: number,
) => {
  if (currentIndex < 0) {
    return findFirstTokenIndex(elements)
  }

  for (const element of elements) {
    if (element.index <= currentIndex) {
      continue
    }

    if (element.type === "DELIMITER" && isParagraphBoundary(element.value)) {
      const nextTokenIndex = findNextTokenAfter(elements, element.index)
      if (nextTokenIndex >= 0) {
        return nextTokenIndex
      }
    }
  }

  return currentIndex
}

export const clampBackwardJumpToPreviousSentence = (
  elements: TextElement[],
  anchorIndex: number,
  proposedIndex: number,
) => {
  if (anchorIndex < 0 || proposedIndex >= anchorIndex) {
    return proposedIndex
  }

  const currentSentenceStart = findSentenceStart(elements, anchorIndex)
  const previousSentenceStart = findPreviousSentenceStart(elements, anchorIndex)
  const minimumAllowedIndex = Math.min(currentSentenceStart, previousSentenceStart)

  return Math.max(proposedIndex, minimumAllowedIndex)
}
