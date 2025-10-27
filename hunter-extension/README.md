# Hunter - YouTube Tutorial Assistant (Chrome Extension)

Hunter enhances YouTube tutorial videos with AI-powered topic detection, concise summaries, and interactive quizzes in a sidebar injected into the YouTube page.

## Features
- Automatically extracts video transcript/captions
- Detects and highlights key topics along the timeline
- Generates collapsible summaries for each detected topic
- Creates interactive quiz questions
- Click to jump to specific timestamps
- Clean, responsive UI with smooth animations
- Options page to store your OpenAI API key locally

## Tech
- Manifest V3 Chrome Extension
- React + TypeScript for the content UI
- Background service worker calls OpenAI API
- Built with esbuild

## Setup
1. Ensure Node.js 18+ is installed.
2. Install dependencies:
```bash
npm install
```
3. Build the extension:
```bash
npm run build
```
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `dist` folder in this project
5. Open the extension Options page and add your OpenAI API Key.
6. Go to a YouTube video with captions enabled (preferably English). Click "Open Hunter" to open the sidebar.

## Notes
- Transcripts are fetched via YouTube's `timedtext` endpoint when available.
- The background worker sends the transcript to OpenAI (`gpt-4o-mini` by default) with instructions to return structured JSON containing topics and quizzes.
- Your API key is stored in `chrome.storage.local` and used only by your browser.

## Development
- Watch mode:
```bash
npm run dev
```
- Re-load the extension in `chrome://extensions` after each build to pick up changes.

## Security
- Do not hardcode your API key in the codebase. Use the Options page to store it locally.

## Limitations
- Some videos may not expose transcripts via the `timedtext` API.
- Very long transcripts are truncated to fit model limits; analysis quality may vary.