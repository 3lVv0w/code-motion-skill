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
