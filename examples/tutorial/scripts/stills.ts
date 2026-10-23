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
