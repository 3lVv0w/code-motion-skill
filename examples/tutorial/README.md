# Example: code-motion tutorial

The 34-second Thai tutorial about the `/code-motion` skill, made with the skill itself in the
[Manga Page](https://www.futurepedia.io/resources/ai-style-atlas/view) style. Two cuts:

| Composition id      | Size      | Output                       |
| ------------------- | --------- | ---------------------------- |
| `tutorial`          | 1280×720  | `out/tutorial.mp4`           |
| `tutorial-vertical` | 1080×1920 | `out/tutorial-vertical.mp4`  |

## Render it

The Manga Page style files belong to Futurepedia, so they are not in this repo. Get them from the
prompt first:

1. Open the [AI Style Atlas](https://www.futurepedia.io/resources/ai-style-atlas/view), pick
   **Manga Page**, copy its prompt and save it as `prompts/manga-page.md`.
2. Install and extract the style files:

   ```bash
   bun install
   bun run setup-style prompts/manga-page.md   # writes src/lib/harness.js, src/lib/sound.js, src/style/manga.js
   ```

3. Preview or render:

   ```bash
   bun run render tutorial --audio   # sound for the Studio
   bun run studio                    # http://localhost:3000
   bun run render tutorial           # out/tutorial.mp4
   bun run render tutorial-vertical  # out/tutorial-vertical.mp4
   ```

`prompts/`, `src/lib/` and `src/style/` are gitignored so the style files are never committed.

## How it is built

| Path                                 | What                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- |
| `src/videos/tutorial/visuals.js`     | Five manga pages, page turns, and the 9:16 panel stacking            |
| `src/videos/tutorial/score.js`       | Every sound, at the same times as the pictures                       |
| `src/videos/tutorial/vertical.js`    | Registers `tutorial-vertical` with a 1080×1920 canvas                |
| `scripts/render.ts`                  | WAV then MP4; `--audio` writes the WAV only                          |
| `scripts/stills.ts`                  | PNGs at given times, for storyboards and checks                      |
| `scripts/setup-style.ts`             | Pulls the third-party style files out of the prompt                  |
| `public/fonts/`                      | Self-hosted fonts and their OFL licences                             |

The style's fonts have no Thai, so Thai text uses Mali (hand lettering) and Kanit (heavy display).
