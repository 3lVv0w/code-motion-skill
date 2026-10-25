// bun run stills <id> <t1> <t2> ...: one PNG per time (seconds), for storyboards and checks.
import { existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { bundle } from "@remotion/bundler"
import { renderStill, selectComposition } from "@remotion/renderer"

const [id, ...times] = process.argv.slice(2)
if (!id || times.length === 0) throw new Error("Usage: bun run stills <id> <t1> <t2> ...")

const root = join(import.meta.dir, "..")
const baseId = id.replace(/-vertical$/, "")
const projectDir = existsSync(join(root, "../../projects", id))
  ? join(root, "../../projects", id)
  : existsSync(join(root, "../../projects", baseId))
  ? join(root, "../../projects", baseId)
  : null
const outDir = projectDir ? join(projectDir, "out") : join(root, "out")
mkdirSync(outDir, { recursive: true })

const inputProps = { id, withAudio: false }
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") })
const composition = await selectComposition({ serveUrl, id, inputProps })
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(t) * composition.fps))
  const output = join(outDir, `${id}-${t}.png`)
  await renderStill({ serveUrl, composition, frame, output, inputProps })
  console.log(output)
}

