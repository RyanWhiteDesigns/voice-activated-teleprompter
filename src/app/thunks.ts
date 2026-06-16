import type { AppThunk } from "./store"
import { start, stop } from "../features/navbar/navbarSlice"
import {
  setFinalTranscriptIndex,
  setInterimTranscriptIndex,
} from "../features/content/contentSlice"
import SpeechRecognizer from "../lib/speech-recognizer"
import { computeSpeechRecognitionTokenIndex } from "../lib/speech-matcher"
import { clampBackwardJumpToPreviousSentence } from "../lib/text-navigation"

let speechRecognizer: SpeechRecognizer | null = null

export const startTeleprompter = (): AppThunk => (dispatch, getState) => {
  dispatch(start())

  speechRecognizer = new SpeechRecognizer()

  speechRecognizer.onresult(
    (final_transcript: string, interim_transcript: string) => {
      const {
        textElements,
        finalTranscriptIndex: lastFinalTranscriptIndex,
      } = getState().content

      if (final_transcript !== "") {
        const matchedFinalTranscriptIndex = computeSpeechRecognitionTokenIndex(
          final_transcript,
          textElements,
          Math.max(lastFinalTranscriptIndex, 0),
        )
        const finalTranscriptIndex = clampBackwardJumpToPreviousSentence(
          textElements,
          lastFinalTranscriptIndex,
          matchedFinalTranscriptIndex,
        )
        dispatch(setFinalTranscriptIndex(finalTranscriptIndex))
      }

      if (interim_transcript !== "") {
        const matchedInterimTranscriptIndex = computeSpeechRecognitionTokenIndex(
          interim_transcript,
          textElements,
          Math.max(lastFinalTranscriptIndex, 0),
        )
        const interimTranscriptIndex = clampBackwardJumpToPreviousSentence(
          textElements,
          lastFinalTranscriptIndex,
          matchedInterimTranscriptIndex,
        )
        dispatch(setInterimTranscriptIndex(interimTranscriptIndex))
      }
    },
  )

  speechRecognizer.start()
}

export const stopTeleprompter = (): AppThunk => dispatch => {
  if (speechRecognizer !== null) {
    speechRecognizer.stop()
    speechRecognizer = null
  }

  dispatch(stop())
}
