# Voice-Activated Teleprompter

This web-based single-page application (SPA) is a voice-activated teleprompter that automatically scrolls along with the script you are reading. It is built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [Redux](https://redux.js.org/), and [Bulma](https://bulma.io/).

**Note:** It supports Dutch, English, French, German, Italian, Brazilian Portuguese, and Spanish speech recognition. The app automatically detects your browser language and defaults accordingly, but you can manually select your preferred language using the dropdown in the toolbar. It was tested only in the Chrome web browser and may not work in other web browsers!

If GitHub Pages is enabled for this repository, the app will be published at:

`https://ryanwhitedesigns.github.io/voice-activated-teleprompter/`

**Instructions:** Once you've opened the live demo, click on the `Edit` button in the toolbar. Paste your script into the content area and click on the `Edit` button again to validate. Then, click on the `Play` button in the toolbar and start reading your script. If you need to take a break, you can click on the `Stop` button at any time, and then later resume the transcription by clicking on the `Play` button again. You can also click on individual words in your script to reset the transcription to a specific index in case you need to re-read a section of your script.

**Hints:** You can add inline hints to your script by wrapping text in square brackets, e.g. `[pause here]` or `[look at camera]`. Hints are displayed in the teleprompter text but are ignored by the speech recognition engine, so they won't interfere with auto-scrolling.

**Keyboard Shortcuts:** While the teleprompter is running (not in edit mode), the following keyboard shortcuts are available:

| Key | Action |
|-----|--------|
| `Space` | Start/stop the teleprompter |
| `Escape` | Stop the teleprompter |
| `Arrow Up` | Jump back 15 words |
| `Arrow Down` | Jump forward 15 words |
| `Arrow Left` | Jump back 5 words |
| `Arrow Right` | Jump forward 5 words |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This runs the TypeScript project build in check mode and then creates a production bundle in `dist/`.

## GitHub Pages Deployment

Deployment is handled automatically by GitHub Actions on pushes to `main` or `master`, and by manual runs from the Actions tab.

In your GitHub repository settings:

1. Go to `Settings` -> `Pages`.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Push to your default branch.
