import { join } from "node:path"
import { spawn } from "node:child_process"
import { parseArgs } from "./social-utils"

const root = join(import.meta.dir, "..")
const { flags, positional } = parseArgs(process.argv.slice(2))
const id = positional[0]

if (!id) {
  console.log(`
Usage: bun run schedule <projectId> [options]

Options:
  --platform <all|yt|ig>   Target platform (default: all)
  --schedule <time>        Schedule publish time (ISO 8601, e.g. 2026-10-26T15:30:00Z)
  --dry-run                Validate configurations and preview payloads without uploading

Examples:
  bun run schedule time-zones --dry-run
  bun run schedule time-zones --platform all
  bun run schedule time-zones --platform yt
  bun run schedule time-zones --platform ig
`)
  process.exit(0)
}

const platform = (flags.platform as string) || "all"
const isDryRun = Boolean(flags["dry-run"])
const scheduleOverride = flags.schedule as string | undefined

async function runChildScript(scriptName: string, extraArgs: string[] = []): Promise<boolean> {
  return new Promise((resolve) => {
    const scriptPath = join(root, "scripts", scriptName)
    const procArgs = ["run", scriptPath, id, ...extraArgs]

    console.log(`\n▶️ Executing: bun ${procArgs.join(" ")}`)
    const child = spawn("bun", procArgs, {
      cwd: root,
      stdio: "inherit",
    })

    child.on("close", (code) => {
      resolve(code === 0)
    })
  })
}

async function main() {
  console.log(`\n======================================================`)
  console.log(`🚀 CODE-MOTION SOCIAL SYNDICATION: ${id}`)
  console.log(`======================================================`)
  console.log(`Target: ${platform.toUpperCase()}`)
  if (isDryRun) {
    console.log(`Mode:   DRY RUN (no network mutations)`)
  }

  const commonArgs: string[] = []
  if (isDryRun) commonArgs.push("--dry-run")
  if (scheduleOverride) commonArgs.push("--schedule", scheduleOverride)

  let ytSuccess = true
  let igSuccess = true

  if (platform === "all" || platform === "yt" || platform === "youtube") {
    console.log(`\n[1/2] Processing YouTube Studio Submission...`)
    ytSuccess = await runChildScript("upload-youtube.ts", commonArgs)
  }

  if (platform === "all" || platform === "ig" || platform === "instagram") {
    console.log(`\n[2/2] Processing Instagram Reels Submission...`)
    igSuccess = await runChildScript("upload-instagram.ts", commonArgs)
  }

  console.log(`\n======================================================`)
  console.log(`📊 EXECUTION SUMMARY`)
  console.log(`======================================================`)
  if (platform === "all" || platform === "yt" || platform === "youtube") {
    console.log(`- YouTube:   ${ytSuccess ? "✅ Succeeded" : "❌ Failed"}`)
  }
  if (platform === "all" || platform === "ig" || platform === "instagram") {
    console.log(`- Instagram: ${igSuccess ? "✅ Succeeded" : "❌ Failed"}`)
  }
  console.log(`======================================================\n`)

  if (!ytSuccess || !igSuccess) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
