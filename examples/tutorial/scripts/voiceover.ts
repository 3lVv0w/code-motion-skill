// bun run voiceover <id>: one TTS clip per beat, each placed at its beat start, mixed into
// public/<id>-voice.mp3 trimmed to the video length. Narration can't drift or run past the end.
//
// Reads src/videos/<id>/narration.json:
//   { voice, rate?, gap?, duration, beats: [{ start, text }], elevenlabs?: { voice, model? } }
//
// Uses Edge TTS (free, no key) with `voice` (an Edge voice name such as "th-TH-PremwadeeNeural").
// If ELEVENLABS_API_KEY is set, uses ElevenLabs instead with `elevenlabs.voice` (a voice ID) and
// `elevenlabs.model` (default eleven_multilingual_v2; use eleven_v3 for Thai and other languages
// multilingual_v2 does not cover). Flags override the file: --engine edge|elevenlabs, --voice, --model.
import { execFileSync } from "node:child_process"
import { createWriteStream, existsSync, mkdirSync, readFileSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"

const args = process.argv.slice(2)
const id = args[0]
if (!id || id.startsWith("-")) {
  console.log("Usage: bun run voiceover <id> [--engine edge|elevenlabs] [--voice <name or id>] [--model <elevenlabs model>]")
  process.exit(1)
}
const getArg = (flag: string) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const root = join(import.meta.dir, "..")
const candidatePath1 = join(root, `src/videos/${id}/narration.json`)
const candidatePath2 = join(root, `../../projects/${id}/narration.json`)
const specPath = existsSync(candidatePath1) ? candidatePath1 : candidatePath2
if (!existsSync(specPath)) throw new Error(`Missing narration.json (checked ${candidatePath1} and ${candidatePath2})`)
const spec = JSON.parse(readFileSync(specPath, "utf8")) as {
  voice?: string // Edge TTS voice name
  rate?: string // Edge TTS speaking rate, e.g. "+10%"
  gap?: number // seconds a clip must end before the next clip starts (default 0.4)
  duration: number
  beats: { start: number; text: string }[]
  elevenlabs?: { voice?: string; model?: string }
}
const gap = spec.gap ?? 0.4

const engine = getArg("--engine") ?? (process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "edge")
if (engine === "elevenlabs" && !process.env.ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not set")
const voice =
  getArg("--voice") ??
  (engine === "elevenlabs" ? spec.elevenlabs?.voice ?? "JBFqnCBsd6RMkjVDRZzb" : spec.voice ?? "en-US-AriaNeural")
const model = getArg("--model") ?? spec.elevenlabs?.model ?? "eleven_multilingual_v2"
const projectDir = join(root, "../../projects", id)
const workDir = existsSync(projectDir) ? join(projectDir, "out", `voice-${id}`) : join(root, `out/voice-${id}`)
mkdirSync(workDir, { recursive: true })
mkdirSync(join(root, "public"), { recursive: true })


const probe = (file: string) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim())

async function edgeClip(text: string, out: string) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const tts = new MsEdgeTTS()
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)
      const { audioStream } = tts.toStream(text, spec.rate ? { rate: spec.rate } : undefined)
      const file = createWriteStream(out)
      await new Promise<void>((resolve, reject) => {
        audioStream.pipe(file)
        file.on("finish", () => resolve())
        file.on("error", reject)
        audioStream.on("error", reject)
      })
      tts.close?.()
      if (probe(out) > 0.5) return
      throw new Error("empty clip")
    } catch (err) {
      if (attempt === 4) throw err
      await new Promise((r) => setTimeout(r, 1500))
    }
  }
}

async function elevenClip(text: string, out: string) {
  // eleven_v3 only accepts stability 0, 0.5 or 1.
  const voice_settings = model === "eleven_v3" ? { stability: 0.5 } : { stability: 0.55, similarity_boost: 0.8 }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: model, voice_settings }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  writeFileSync(out, Buffer.from(await res.arrayBuffer()))
}

console.log(`[voiceover] ${id}: ${spec.beats.length} beats, engine=${engine}, voice=${voice}${engine === "elevenlabs" ? `, model=${model}` : ""}`)
const clips: { file: string; start: number }[] = []
let overruns = 0
const force = args.includes("--force")
for (const [i, beat] of spec.beats.entries()) {
  const file = join(workDir, `beat-${String(i + 1).padStart(2, "0")}.mp3`)
  if (force || !existsSync(file) || probe(file) <= 0) {
    if (engine === "elevenlabs") await elevenClip(beat.text, file)
    else await edgeClip(beat.text, file)
  }
  const len = probe(file)
  const slotEnd = (spec.beats[i + 1]?.start ?? spec.duration) - gap
  const slot = slotEnd - beat.start
  const flag = len > slot ? "  OVERRUNS SLOT" : ""
  if (len > slot) overruns++
  console.log(`  beat ${i + 1}: ${beat.start.toFixed(1)}s -> ends ${(beat.start + len).toFixed(2)}s (clip ${len.toFixed(2)}s / slot ${slot.toFixed(2)}s)${flag}`)
  clips.push({ file, start: beat.start })
}

// Place every clip at its start time, mix (no level normalisation), and trim to the video length.
const inputs = clips.flatMap((c) => ["-i", c.file])
const delays = clips.map((c, i) => `[${i}:a]adelay=${Math.round(c.start * 1000)}:all=1[a${i}]`).join(";")
const mix = `${clips.map((_, i) => `[a${i}]`).join("")}amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${spec.duration}[out]`
const targetVoice = existsSync(projectDir) ? join(projectDir, `${id}-voice.mp3`) : join(root, `public/${id}-voice.mp3`)
execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", `${delays};${mix}`, "-map", "[out]", "-ar", "48000", "-b:a", "128k", targetVoice])
if (existsSync(projectDir)) {
  const publicLink = join(root, `public/${id}-voice.mp3`)
  try { unlinkSync(publicLink) } catch {}
  symlinkSync(`../../../projects/${id}/${id}-voice.mp3`, publicLink)
}
console.log(`Wrote ${targetVoice} (${probe(targetVoice).toFixed(2)}s)`)

if (overruns) {
  console.error(`${overruns} clip(s) run longer than their slot. Shorten that text or move the next beat's start.`)
  process.exit(2)
}
process.exit(0)
