// bun run render <id>: renders the score to public/<id>.wav, then the video to out/<id>.mp4.
import { existsSync, mkdirSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { bundle } from "@remotion/bundler"
import { renderMedia, selectComposition } from "@remotion/renderer"

const id = process.argv[2]
if (!id) throw new Error("Usage: bun run render <id>")

const root = join(import.meta.dir, "..")
const entryPoint = join(root, "src/index.ts")

const baseId = id.replace(/-vertical$/, "")
const projectDir = existsSync(join(root, "../../projects", id))
  ? join(root, "../../projects", id)
  : existsSync(join(root, "../../projects", baseId))
  ? join(root, "../../projects", baseId)
  : null

// Remotion's serve-handler returns 404 for symbolic links in publicDir.
// Ensure any project media (mp3, wav) exists as real concrete files in public/.
if (projectDir) {
  const { readdirSync, copyFileSync, lstatSync, realpathSync } = await import("node:fs")
  const projectFiles = readdirSync(projectDir)
  for (const file of projectFiles) {
    if (/\.(mp3|wav)$/.test(file)) {
      const src = join(projectDir, file)
      const dest = join(root, "public", file)
      try {
        const real = realpathSync(src)
        try { unlinkSync(dest) } catch {}
        copyFileSync(real, dest)
      } catch {}
    }
  }
}

let initialServeUrl = await bundle({ entryPoint })
let hasSynthesizedAudio = false

try {
  const audio = await selectComposition({ serveUrl: initialServeUrl, id: `${id}-audio` })
  const { pcm, sampleRate } = audio.props as { pcm: string; sampleRate: number }
  if (pcm && pcm.length > 0) {
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
    const wavBuffer = Buffer.concat([header, data])
    const publicWav = join(root, `public/${id}.wav`)
    try { unlinkSync(publicWav) } catch {}
    writeFileSync(publicWav, wavBuffer)
    if (projectDir) {
      writeFileSync(join(projectDir, `${id}.wav`), wavBuffer)
    }
    hasSynthesizedAudio = true
  }
} catch {
  // Video does not have a synthesized score composition (e.g., uses pre-existing music or voice)
}

if (process.argv.includes("--audio")) {
  if (hasSynthesizedAudio) console.log(`Synthesized audio ready for ${id}`)
  else console.log(`No synthesized audio score for ${id}`)
  process.exit(0)
}

// Re-bundle only if a new WAV was written into public/
const serveUrl = hasSynthesizedAudio ? await bundle({ entryPoint }) : initialServeUrl
const composition = await selectComposition({ serveUrl, id })
const outDir = projectDir ? join(projectDir, "out") : join(root, "out")
mkdirSync(outDir, { recursive: true })
const outputLocation = join(outDir, `${id}.mp4`)
await renderMedia({ serveUrl, composition, codec: "h264", outputLocation })
console.log(`Rendered: ${outputLocation}`)

