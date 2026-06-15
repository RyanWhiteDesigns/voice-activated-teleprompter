import { useEffect, useLayoutEffect, useRef } from "react"
import { escape } from "html-escaper"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  setContent,
  setFinalTranscriptIndex,
  setInterimTranscriptIndex,
} from "./contentSlice"

import {
  selectStatus,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectFontSize,
  selectMargin,
  selectTextBrightness,
  selectLinePosition,
} from "../navbar/navbarSlice"

import {
  selectRawText,
  selectTextElements,
  selectFinalTranscriptIndex,
  selectInterimTranscriptIndex,
} from "./contentSlice"

import { startTeleprompter, stopTeleprompter } from "../../app/thunks"
import {
  findParagraphStart,
  findNextParagraphStart,
  findNextSentenceStart,
  findSentenceStart,
  findPreviousParagraphStart,
  findPreviousSentenceStart,
} from "../../lib/text-navigation"

export const Content = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectStatus)
  const fontSize = useAppSelector(selectFontSize)
  const margin = useAppSelector(selectMargin)
  const textBrightness = useAppSelector(selectTextBrightness)
  const linePosition = useAppSelector(selectLinePosition)
  const horizontallyFlipped = useAppSelector(selectHorizontallyFlipped)
  const verticallyFlipped = useAppSelector(selectVerticallyFlipped)
  const rawText = useAppSelector(selectRawText)
  const textElements = useAppSelector(selectTextElements)
  const finalTranscriptIndex = useAppSelector(selectFinalTranscriptIndex)
  const interimTranscriptIndex = useAppSelector(selectInterimTranscriptIndex)

  const style = {
    fontSize: `${fontSize}px`,
    padding: `0 ${margin}px`,
    lineHeight: "1.3",
  }

  const unreadShade = Math.round((textBrightness / 100) * 255)
  const unreadColor = `rgb(${unreadShade} ${unreadShade} ${unreadShade})`
  const finalShade = Math.max(Math.round(unreadShade * 0.3), 25)
  const finalColor = `rgb(${finalShade} ${finalShade} ${finalShade})`
  const interimColor = `rgb(${Math.max(unreadShade, 60)} ${Math.max(
    Math.round(unreadShade * 0.85),
    50,
  )} ${Math.max(Math.round(unreadShade * 0.25), 20)})`

  const containerRef = useRef<null | HTMLDivElement>(null)
  const activeLineRef = useRef<null | HTMLSpanElement>(null)
  const topSpacerRef = useRef<null | HTMLDivElement>(null)
  const bottomSpacerRef = useRef<null | HTMLDivElement>(null)
  const syncTranscriptPosition = (nextIndex: number) => {
    dispatch(setFinalTranscriptIndex(nextIndex))
    dispatch(setInterimTranscriptIndex(nextIndex))
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const targetOffset =
      (containerRef.current.clientHeight * linePosition) / 100

    if (activeLineRef.current) {
      containerRef.current.scrollTo({
        top: Math.max(activeLineRef.current.offsetTop - targetOffset, 0),
        behavior: "auto",
      })
      return
    }

    containerRef.current.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }, [interimTranscriptIndex, finalTranscriptIndex, linePosition])

  useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !topSpacerRef.current ||
      !bottomSpacerRef.current
    ) {
      return
    }

    const containerHeight = containerRef.current.clientHeight
    const targetOffset = (containerHeight * linePosition) / 100
    topSpacerRef.current.style.height = `${targetOffset}px`
    bottomSpacerRef.current.style.height = `${Math.max(
      containerHeight - targetOffset,
      0,
    )}px`
  }, [linePosition, textElements.length, fontSize, margin])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (status === "editing") return

      const maxIndex = textElements.length - 1

      if (event.code === "Escape") {
        event.preventDefault()
        dispatch(stopTeleprompter())
      } else if (event.code === "Space") {
        event.preventDefault()
        if (status === "stopped") {
          dispatch(startTeleprompter())
        } else if (status === "started") {
          dispatch(stopTeleprompter())
        }
      } else if (event.code === "ArrowUp") {
        event.preventDefault()
        const activeIndex = Math.max(finalTranscriptIndex, interimTranscriptIndex)
        const currentParagraphStart = findParagraphStart(
          textElements,
          Math.max(activeIndex, 0),
        )
        syncTranscriptPosition(
          activeIndex === currentParagraphStart
            ? findPreviousParagraphStart(textElements, Math.max(activeIndex, 0))
            : currentParagraphStart,
        )
      } else if (event.code === "ArrowLeft") {
        event.preventDefault()
        const activeIndex = Math.max(finalTranscriptIndex, interimTranscriptIndex)
        const currentSentenceStart = findSentenceStart(
          textElements,
          Math.max(activeIndex, 0),
        )
        syncTranscriptPosition(
          activeIndex === currentSentenceStart
            ? findPreviousSentenceStart(textElements, Math.max(activeIndex, 0))
            : currentSentenceStart,
        )
      } else if (event.code === "ArrowDown") {
        event.preventDefault()
        const activeIndex = Math.max(finalTranscriptIndex, interimTranscriptIndex)
        syncTranscriptPosition(
          Math.min(
            maxIndex,
            findNextParagraphStart(textElements, Math.max(activeIndex, 0)),
          ),
        )
      } else if (event.code === "ArrowRight") {
        event.preventDefault()
        const activeIndex = Math.max(finalTranscriptIndex, interimTranscriptIndex)
        syncTranscriptPosition(
          Math.min(
            maxIndex,
            findNextSentenceStart(textElements, Math.max(activeIndex, 0)),
          ),
        )
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  })

  return (
    <main className="content-area">
      {status === "editing" ? (
        <textarea
          className="content"
          style={style}
          value={rawText}
          onChange={e => dispatch(setContent(e.target.value || ""))}
        />
      ) : (
        <div
          className="content"
          ref={containerRef}
          style={{
            ...style,
            transform: `scale(${horizontallyFlipped ? "-1" : "1"}, ${verticallyFlipped ? "-1" : "1"})`,
          }}
        >
          <div
            aria-hidden="true"
            ref={topSpacerRef}
            style={{ height: 0, flexShrink: 0 }}
          />
          {textElements.map((textElement, index) => {
            const isFinal =
              finalTranscriptIndex >= 0 &&
              textElement.index <= finalTranscriptIndex + 1
            const isInterim =
              !isFinal &&
              interimTranscriptIndex >= 0 &&
              textElement.index <= interimTranscriptIndex + 1
            const activeIndex = Math.max(
              0,
              Math.min(
                Math.max(interimTranscriptIndex, finalTranscriptIndex) + 2,
                textElements.length - 1,
              ),
            )
            const itemProps = index === activeIndex ? { ref: activeLineRef } : {}

            return (
              <span
                key={textElement.index}
                onClick={() => {
                  dispatch(setFinalTranscriptIndex(index - 1))
                  dispatch(setInterimTranscriptIndex(index - 1))
                }}
                className={
                  isFinal
                    ? "final-transcript"
                    : isInterim
                      ? "interim-transcript"
                      : undefined
                }
                style={{
                  color: isFinal
                    ? finalColor
                    : isInterim
                      ? interimColor
                      : unreadColor,
                }}
                {...itemProps}
                dangerouslySetInnerHTML={{
                  __html: escape(textElement.value).replace(/\n/g, "<br>"),
                }}
              />
            )
          })}
          <div
            aria-hidden="true"
            ref={bottomSpacerRef}
            style={{ height: 0, flexShrink: 0 }}
          />
        </div>
      )}
    </main>
  )
}
