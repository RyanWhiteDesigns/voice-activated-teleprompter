import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { startTeleprompter, stopTeleprompter } from "../../app/thunks"

import {
  toggleEdit,
  flipHorizontally,
  flipVertically,
  setFontSize,
  setMargin,
  setTextBrightness,
  setLinePosition,
  selectStatus,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectFontSize,
  selectMargin,
  selectTextBrightness,
  selectLinePosition,
} from "./navbarSlice"

import { resetTranscriptionIndices } from "../content/contentSlice"

export const NavBar = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectStatus)
  const fontSize = useAppSelector(selectFontSize)
  const margin = useAppSelector(selectMargin)
  const textBrightness = useAppSelector(selectTextBrightness)
  const linePosition = useAppSelector(selectLinePosition)
  const horizontallyFlipped = useAppSelector(selectHorizontallyFlipped)
  const verticallyFlipped = useAppSelector(selectVerticallyFlipped)

  const toggleFullscreen = async (shouldEnter: boolean) => {
    try {
      if (shouldEnter) {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen({
            navigationUI: "hide",
          })
        }
      } else if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {
      // If the browser blocks fullscreen, keep teleprompter controls working.
    }
  }

  const handleStartStop = async () => {
    if (status === "stopped") {
      await toggleFullscreen(true)
      dispatch(startTeleprompter())
      return
    }

    dispatch(stopTeleprompter())
    await toggleFullscreen(false)
  }

  return (
    <nav
      className="navbar is-black has-text-light is-unselectable"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <div className="title has-text-grey">Voice-Activated Teleprompter</div>
        </div>
      </div>
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          {status === "stopped" ? (
            <>
              <div className="navbar-item slider">
                <span>Font size:</span>
                <input
                  type="range"
                  step="5"
                  min="10"
                  max="200"
                  value={fontSize}
                  onChange={e =>
                    dispatch(setFontSize(parseInt(e.currentTarget.value, 10)))
                  }
                />
              </div>
              <div className="navbar-item slider">
                <span>Margin:</span>
                <input
                  type="range"
                  step="10"
                  min="0"
                  max="500"
                  value={margin}
                  onChange={e =>
                    dispatch(setMargin(parseInt(e.currentTarget.value, 10)))
                  }
                />
              </div>
              <div className="navbar-item slider">
                <span>Text brightness:</span>
                <input
                  type="range"
                  step="5"
                  min="0"
                  max="100"
                  value={textBrightness}
                  onChange={e =>
                    dispatch(
                      setTextBrightness(parseInt(e.currentTarget.value, 10)),
                    )
                  }
                />
              </div>
              <div className="navbar-item slider">
                <span>Line position:</span>
                <input
                  type="range"
                  step="5"
                  min="10"
                  max="80"
                  value={linePosition}
                  onChange={e =>
                    dispatch(setLinePosition(parseInt(e.currentTarget.value, 10)))
                  }
                />
              </div>
            </>
          ) : null}

          <div className="buttons navbar-item">
            {status !== "started" ? (
              <>
                <button
                  className={`button ${status === "editing" ? "editing" : ""}`}
                  onClick={() => dispatch(toggleEdit())}
                  title="Edit"
                >
                  <span className="icon is-small">
                    <i className="fa-solid fa-pencil" />
                  </span>
                </button>
                <button
                  className={`button ${horizontallyFlipped ? "horizontally-flipped" : ""}`}
                  disabled={status !== "stopped"}
                  onClick={() => dispatch(flipHorizontally())}
                  title="Flip Text Horizontally"
                >
                  <span className="icon is-small">
                    <i className="fa-solid fa-left-right" />
                  </span>
                </button>
                <button
                  className={`button ${verticallyFlipped ? "vertically-flipped" : ""}`}
                  disabled={status !== "stopped"}
                  onClick={() => dispatch(flipVertically())}
                  title="Flip Text Vertically"
                >
                  <span className="icon is-small">
                    <i className="fa-solid fa-up-down" />
                  </span>
                </button>
                <button
                  className="button"
                  disabled={status !== "stopped"}
                  onClick={() => dispatch(resetTranscriptionIndices())}
                  title="Restart from the beginning"
                >
                  <span className="icon is-small">
                    <i className="fa-solid fa-arrows-rotate" />
                  </span>
                </button>
              </>
            ) : null}

            <button
              className="button start-stop-button"
              disabled={status === "editing"}
              onClick={() => void handleStartStop()}
              title={
                status === "stopped" || status === "editing" ? "Start" : "Stop"
              }
            >
              <span className="icon is-small">
                <i
                  className={`fa-solid ${status === "stopped" || status === "editing" ? "fa-play" : "fa-stop"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
