import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export interface NavBarSliceState {
  status: "editing" | "started" | "stopped"
  horizontallyFlipped: boolean
  verticallyFlipped: boolean
  fontSize: number
  margin: number
  textBrightness: number
  linePosition: number
}

const initialState: NavBarSliceState = {
  status: "stopped",
  horizontallyFlipped: false,
  verticallyFlipped: false,
  fontSize: 60,
  margin: 10,
  textBrightness: 35,
  linePosition: 25,
}

export const navbarSlice = createAppSlice({
  name: "navbar",
  initialState,
  reducers: create => ({
    toggleEdit: create.reducer(state => {
      state.status = state.status === "editing" ? "stopped" : "editing"
    }),

    start: create.reducer(state => {
      state.status = "started"
    }),

    stop: create.reducer(state => {
      state.status = "stopped"
    }),

    flipHorizontally: create.reducer(state => {
      state.horizontallyFlipped = !state.horizontallyFlipped
    }),

    flipVertically: create.reducer(state => {
      state.verticallyFlipped = !state.verticallyFlipped
    }),

    setFontSize: create.reducer((state, action: PayloadAction<number>) => {
      state.fontSize = action.payload
    }),

    setMargin: create.reducer((state, action: PayloadAction<number>) => {
      state.margin = action.payload
    }),

    setTextBrightness: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.textBrightness = action.payload
      },
    ),

    setLinePosition: create.reducer((state, action: PayloadAction<number>) => {
      state.linePosition = action.payload
    }),
  }),

  selectors: {
    selectStatus: state => state.status,
    selectFontSize: state => state.fontSize,
    selectMargin: state => state.margin,
    selectHorizontallyFlipped: state => state.horizontallyFlipped,
    selectVerticallyFlipped: state => state.verticallyFlipped,
    selectTextBrightness: state => state.textBrightness,
    selectLinePosition: state => state.linePosition,
  },
})

export const {
  toggleEdit,
  start,
  stop,
  flipHorizontally,
  flipVertically,
  setFontSize,
  setMargin,
  setTextBrightness,
  setLinePosition,
} = navbarSlice.actions

export const {
  selectStatus,
  selectFontSize,
  selectMargin,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectTextBrightness,
  selectLinePosition,
} = navbarSlice.selectors
