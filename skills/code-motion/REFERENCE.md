# Code motion: Remotion shell

The shell is the same for every video and every style. Create these files once. Versions were
current when written; use what the repo already pins if it has them.

```text
<video-app>/
  package.json
  tsconfig.json
  .gitignore
  scripts/render.ts          # bun run render <id>: WAV first, then MP4 (--audio: WAV only)
  scripts/stills.ts          # bun run stills <id> <t1> <t2>...: PNGs for storyboards and checks
  src/index.ts               # registerRoot
  src/config.ts              # size, fps, fonts, logo
  src/Root.tsx               # one video + one audio composition per id
  src/VideoCanvas.tsx        # draws visuals.js on a canvas each frame
  src/videos/index.ts        # imports every video's scripts
  src/videos/<id>/visuals.js # window.VIDEOS[id] = { draw, duration }
  src/videos/<id>/score.js   # window.VIDEOS[id].score = (k) => ...
  src/lib/                   # helper library + sound kit, copied from the style prompt
  prompts/<style>.md         # style prompt, verbatim
  public/fonts/              # self-hosted fonts + fonts.css
  public/logo.svg            # optional
```

## package.json

```json
{
  "name": "video",
  "private": true,
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "render": "bun scripts/render.ts",
    "stills": "bun scripts/stills.ts"
  },
  "dependencies": {
    "@remotion/bundler": "4.0.530",
    "@remotion/cli": "4.0.530",
    "@remotion/renderer": "4.0.530",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "remotion": "4.0.530"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["bun"]
  },
  "include": ["src", "scripts"]
}
```

## .gitignore

```text
out/
public/*.wav
node_modules/
```

## src/index.ts

```ts
import { registerRoot } from "remotion"
import { Root } from "./Root"

registerRoot(Root)
```

## src/config.ts

```ts
export const FPS = 30
export const WIDTH = 1280
export const HEIGHT = 720
export const SAMPLE_RATE = 48000
// Every weight the videos use; rendering waits for each one.
export const FONT_SPECS = ['800 84px "Noto Sans"', '600 28px "Noto Sans"', '400 18px "Noto Sans"']
// Text that covers the scripts on screen, so the right font files load.
export const FONT_SAMPLE = "AaZz09"
// Logo file in public/, or "" for videos without one.
export const LOGO = "logo.svg"
```

## src/videos/index.ts

```ts
// Plain browser scripts that publish window globals. Order matters: lib first.
import "../lib/harness.js"
import "../lib/sound.js"
import "./trailer/visuals.js"
import "./trailer/score.js"

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
type OfflineResult = { inter: Float32Array; peak: number; sr: number }

declare global {
  interface Window {
    VIDEOS: Record<string, { draw: Draw; duration: number; score: unknown; width?: number; height?: number }>
    SOUND: {
      renderOffline: (score: unknown, duration: number, sampleRate: number, opts: object) => Promise<OfflineResult>
    }
    LOGO: HTMLImageElement | null
  }
}

export const VIDEOS = window.VIDEOS
```

Adapt `SOUND.renderOffline` to the sound kit's real API if the style prompt names it differently.

## Video script contract

```js
// src/videos/<id>/visuals.js
;(function () {
  const draw = (ctx, W, H, t) => {
    /* pure function of t */
  }
  window.VIDEOS = window.VIDEOS || {}
  window.VIDEOS["<id>"] = { ...window.VIDEOS["<id>"], draw, duration: 25 }
})()

// src/videos/<id>/score.js
;(function () {
  window.VIDEOS["<id>"].score = (k) => {
    /* k.play / k.tone / k.noise at the same times as visuals.js */
  }
})()
```

## src/VideoCanvas.tsx

```tsx
import { useEffect, useRef, useState } from "react"
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { FONT_SAMPLE, FONT_SPECS, FPS, LOGO } from "./config"
import { VIDEOS } from "./videos"

const FONT_CSS = staticFile("fonts/fonts.css")

const loadAssets = async () => {
  if (!document.querySelector(`link[href="${FONT_CSS}"]`)) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = FONT_CSS
    document.head.appendChild(link)
    await new Promise((resolve) => link.addEventListener("load", resolve, { once: true }))
  }
  await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec, FONT_SAMPLE)))
  if (!LOGO) return
  const logo = new Image()
  logo.src = staticFile(LOGO)
  await logo.decode()
  window.LOGO = logo
}

export const VideoCanvas = ({ id, withAudio }: { id: string; withAudio: boolean }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [handle] = useState(() => delayRender("Loading fonts and logo"))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadAssets().then(() => {
      setReady(true)
      continueRender(handle)
    })
  }, [handle])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ready || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    VIDEOS[id]!.draw(ctx, width, height, frame / FPS)
  }, [id, frame, ready, width, height])

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={width} height={height} />
      {withAudio ? <Audio src={staticFile(`${id}.wav`)} /> : null}
    </AbsoluteFill>
  )
}
```

## src/Root.tsx

The `<id>-audio` composition renders the score inside the browser and hands the PCM back to Node
through `calculateMetadata` props, because Web Audio only exists in the browser.

```tsx
import { Composition } from "remotion"
import { FPS, HEIGHT, SAMPLE_RATE, WIDTH } from "./config"
import { VideoCanvas } from "./VideoCanvas"
import { VIDEOS } from "./videos"

const renderScore = async (id: string) => {
  const video = VIDEOS[id]!
  const r = await window.SOUND.renderOffline(video.score, video.duration, SAMPLE_RATE, {})
  const norm = r.peak > 0.98 ? 0.98 / r.peak : 1
  const pcm = new Int16Array(r.inter.length)
  for (let i = 0; i < pcm.length; i++) pcm[i] = Math.max(-1, Math.min(1, r.inter[i]! * norm)) * 32767
  const bytes = new Uint8Array(pcm.buffer)
  let bin = ""
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { pcm: btoa(bin), sampleRate: r.sr }
}

export const Root = () => (
  <>
    {Object.entries(VIDEOS).map(([id, video]) => (
      <div key={id}>
        <Composition
          id={id}
          component={VideoCanvas}
          durationInFrames={Math.round(video.duration * FPS)}
          fps={FPS}
          width={video.width ?? WIDTH}
          height={video.height ?? HEIGHT}
          defaultProps={{ id, withAudio: true }}
        />
        <Composition
          id={`${id}-audio`}
          component={() => null}
          durationInFrames={1}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ pcm: "", sampleRate: SAMPLE_RATE }}
          calculateMetadata={async () => ({ props: await renderScore(id) })}
        />
      </div>
    ))}
  </>
)
```

Video ids must match `[a-zA-Z0-9-]+`.

## Several sizes (16:9 and 9:16)

Each video can set its own canvas size; `config.ts` WIDTH/HEIGHT is the default. Register the same
drawing and score again under a new id with a portrait size:

```js
// src/videos/<id>/vertical.js, imported after score.js in src/videos/index.ts
;(function () {
  window.VIDEOS["<id>-vertical"] = { ...window.VIDEOS["<id>"], width: 1080, height: 1920 }
})()
```

`draw(ctx, W, H, t)` then gets 1080×1920, so branch on `H > W`. A quick way to reuse a landscape
page: draw it at 2× on an offscreen canvas, then clip each panel and stack the panels top to bottom
in reading order, splitting very wide panels in two. Redraw title and summary pages natively.
Render with `bun run render <id>-vertical`.

## scripts/render.ts

```ts
// bun run render <id>: renders the score to public/<id>.wav, then the video to out/<id>.mp4.
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { bundle } from "@remotion/bundler"
import { renderMedia, selectComposition } from "@remotion/renderer"

const id = process.argv[2]
if (!id) throw new Error("Usage: bun run render <id>")

const root = join(import.meta.dir, "..")
const entryPoint = join(root, "src/index.ts")

const audio = await selectComposition({ serveUrl: await bundle({ entryPoint }), id: `${id}-audio` })
const { pcm, sampleRate } = audio.props as { pcm: string; sampleRate: number }
const data = Buffer.from(pcm, "base64")
const header = Buffer.alloc(44)
header.write("RIFF", 0)
header.writeUInt32LE(36 + data.length, 4)
header.write("WAVEfmt ", 8)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20) // PCM
header.writeUInt16LE(2, 22) // stereo
header.writeUInt32LE(sampleRate, 24)
header.writeUInt32LE(sampleRate * 4, 28)
header.writeUInt16LE(4, 32)
header.writeUInt16LE(16, 34)
header.write("data", 36)
header.writeUInt32LE(data.length, 40)
writeFileSync(join(root, `public/${id}.wav`), Buffer.concat([header, data]))
if (process.argv.includes("--audio")) {
  console.log(`Wrote public/${id}.wav`)
  process.exit(0)
}

// Bundle again so the new WAV is in the served public folder.
const serveUrl = await bundle({ entryPoint })
const composition = await selectComposition({ serveUrl, id })
mkdirSync(join(root, "out"), { recursive: true })
const outputLocation = join(root, `out/${id}.mp4`)
await renderMedia({ serveUrl, composition, codec: "h264", outputLocation })
console.log(`Wrote public/${id}.wav and ${outputLocation}`)
```

This assumes the sound kit returns interleaved stereo (`inter`). If it returns mono, set channels
to 1 and the byte rate and block align to `sampleRate * 2` and `2`.

## scripts/stills.ts

Bundles once and renders many frames, much faster than one `remotion still` call per frame.

```ts
// bun run stills <id> <t1> <t2> ...: one PNG per time (seconds), for storyboards and checks.
import { join } from "node:path"
import { bundle } from "@remotion/bundler"
import { renderStill, selectComposition } from "@remotion/renderer"

const [id, ...times] = process.argv.slice(2)
if (!id || times.length === 0) throw new Error("Usage: bun run stills <id> <t1> <t2> ...")

const root = join(import.meta.dir, "..")
const inputProps = { id, withAudio: false }
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") })
const composition = await selectComposition({ serveUrl, id, inputProps })
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(t) * composition.fps))
  await renderStill({ serveUrl, composition, frame, output: join(root, `out/${id}-${t}.png`), inputProps })
  console.log(`out/${id}-${t}.png`)
}
```

## Remotion Studio

`bun run studio` opens the Studio in the browser (http://localhost:3000): pick the video in the
sidebar, scrub the timeline, and every saved edit to `visuals.js` reloads at once. It plays
`public/<id>.wav`, so run `bun run render <id> --audio` first and again after changing `score.js`.

## Fonts for other scripts

A style's fonts often cover Latin only. For Thai, Japanese, Arabic and so on, pick a font with the
same feel per role (hand-lettered, heavy display, mono) and switch to it only for text in that
script, for example:

```js
const THAI = /[\u0E00-\u0E7F]/
const F = (size, s) => (THAI.test(s) ? `700 ${size}px "Mali"` : `400 ${size}px "Patrick Hand"`)
```

Add those faces to `FONT_SPECS` and a sample of the script to `FONT_SAMPLE` so rendering waits for
them.

## Self-hosting fonts

Fetch the Google Fonts CSS with a browser User-Agent so it returns woff2, download the files for
the subsets you need into `public/fonts/`, and rewrite the `url(...)` entries to the local file
names in `public/fonts/fonts.css`. Keep the font's licence (most Google Fonts are SIL OFL 1.1,
which allows this).
