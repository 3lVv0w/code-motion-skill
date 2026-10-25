import { existsSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { loadSocialConfig, loadSocialEnv, parseArgs } from "./social-utils"

const root = join(import.meta.dir, "..")
loadSocialEnv(root)

const { flags, positional } = parseArgs(process.argv.slice(2))
const id = positional[0]

if (!id) {
  console.log(`
Usage: bun run upload:ig <projectId> [options]

Options:
  --caption "<text>"      Override caption with custom hashtags
  --schedule <time>       Schedule publish time (ISO 8601, e.g. 2026-10-26T15:30:00Z)
  --thumb-offset <ms>     Thumbnail frame offset in milliseconds (default: 4000)
  --dry-run               Validate credentials, files, and payload without uploading

Examples:
  bun run upload:ig time-zones --dry-run
  bun run upload:ig time-zones --schedule "2026-10-26T15:30:00Z"
`)
  process.exit(0)
}

const { config, projectDir } = loadSocialConfig(root, id)

// Credentials
const igUserId = process.env.INSTAGRAM_USER_ID
const igAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  // 1. Resolve Video (Reels must be 9:16 vertical video)
  const relativeVideo = config.files?.verticalVideo || `out/${id}-vertical.mp4`
  const videoPath = join(projectDir, relativeVideo)

  if (!existsSync(videoPath)) {
    throw new Error(
      `Vertical video file not found at: ${videoPath}\n` +
      `Instagram Reels requires a 9:16 vertical video.\n` +
      `Please render it first using: bun run render ${id}-vertical`
    )
  }

  const fileSize = statSync(videoPath).size
  const caption = (flags.caption as string) || config.instagram?.caption || ""
  const scheduleTime = (flags.schedule as string) || config.instagram?.scheduledPublishTime
  const thumbOffsetMs = Number(flags["thumb-offset"] || config.instagram?.thumbOffsetMs || 4000)

  let scheduledUnixSeconds: number | undefined
  if (scheduleTime) {
    const scheduledDate = new Date(scheduleTime)
    scheduledUnixSeconds = Math.floor(scheduledDate.getTime() / 1000)
    const nowSeconds = Math.floor(Date.now() / 1000)
    const diffSeconds = scheduledUnixSeconds - nowSeconds

    // Instagram API constraints: 15 minutes <= diff <= 75 days
    if (diffSeconds < 15 * 60) {
      console.warn(`[WARN] Scheduled time is less than 15 minutes in the future (${Math.round(diffSeconds / 60)}m).`)
    }
    if (diffSeconds > 75 * 24 * 3600) {
      throw new Error(`Scheduled time cannot exceed 75 days in the future.`)
    }
  }

  console.log(`\n======================================================`)
  console.log(`📸 Instagram Reels Submission & Scheduling: ${id}`)
  console.log(`======================================================`)
  console.log(`📹 Video: ${videoPath} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`)
  console.log(`📝 Caption Length: ${caption.length} chars`)
  if (scheduledUnixSeconds) {
    console.log(`⏰ Scheduled Publish Time: ${new Date(scheduledUnixSeconds * 1000).toISOString()}`)
    console.log(`   (Unix Timestamp: ${scheduledUnixSeconds})`)
    console.log(`   (Local Time: ${new Date(scheduledUnixSeconds * 1000).toLocaleString()})`)
  }

  if (flags["dry-run"]) {
    console.log(`\n🔍 [DRY RUN] Instagram Request Parameters:`)
    console.log({
      media_type: "REELS",
      upload_type: "resumable",
      caption_preview: caption.slice(0, 120) + "...",
      scheduled_publish_time: scheduledUnixSeconds,
      thumb_offset: thumbOffsetMs,
    })
    console.log(`\nCredentials check:`)
    console.log(`- INSTAGRAM_USER_ID: ${igUserId ? "✅ Present (" + igUserId + ")" : "❌ Missing"}`)
    console.log(`- INSTAGRAM_ACCESS_TOKEN: ${igAccessToken ? "✅ Present (" + igAccessToken.slice(0, 10) + "...)" : "❌ Missing"}`)
    console.log(`\n✅ Dry-run complete. Everything is configured and ready for live upload.`)
    return
  }

  if (!igUserId || !igAccessToken) {
    throw new Error(
      `Instagram API credentials missing!\n` +
      `Please set INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in examples/tutorial/.env\n` +
      `Generate them via Meta Graph API Explorer: https://developers.facebook.com/tools/explorer/\n` +
      `Required permissions: instagram_basic, instagram_content_publish`
    )
  }

  // 2. Initialize Resumable Session
  console.log(`\n[Instagram] 1/4 Initializing resumable Reel container on IG User ${igUserId}...`)
  const initParams = new URLSearchParams({
    media_type: "REELS",
    upload_type: "resumable",
    caption,
    access_token: igAccessToken,
  })

  if (scheduledUnixSeconds) {
    initParams.append("scheduled_publish_time", String(scheduledUnixSeconds))
  }
  if (thumbOffsetMs > 0) {
    initParams.append("thumb_offset", String(thumbOffsetMs))
  }

  const initRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: initParams.toString(),
  })

  if (!initRes.ok) {
    const errorBody = await initRes.text()
    throw new Error(`Failed to create Instagram media container: ${initRes.status} ${initRes.statusText}\n${errorBody}`)
  }

  const initData = (await initRes.json()) as { id: string; uri: string }
  const containerId = initData.id
  const uploadUri = initData.uri
  console.log(`[Instagram] ✅ Container created. Container ID: ${containerId}`)
  console.log(`[Instagram] Upload URI endpoint received.`)

  // 3. Upload Binary Video to rupload.facebook.com
  console.log(`[Instagram] 2/4 Uploading video bytes to Meta upload server (${(fileSize / (1024 * 1024)).toFixed(2)} MB)...`)
  const videoBuffer = readFileSync(videoPath)

  const uploadRes = await fetch(uploadUri, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${igAccessToken}`, // Meta requires OAuth scheme here
      offset: "0",
      file_size: String(fileSize),
      "Content-Type": "application/octet-stream",
    },
    body: videoBuffer,
  })

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text()
    throw new Error(`Failed to upload video to Meta rupload server: ${uploadRes.status} ${uploadRes.statusText}\n${errorBody}`)
  }

  console.log(`[Instagram] ✅ Video binary transfer complete.`)

  // 4. Poll Processing Status
  console.log(`[Instagram] 3/4 Waiting for Instagram video processing...`)
  let attempts = 0
  const maxAttempts = 30 // ~2.5 minutes max
  let isReady = false

  while (attempts < maxAttempts) {
    attempts++
    await sleep(5000)

    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${containerId}?fields=status_code,status&access_token=${igAccessToken}`
    )

    if (statusRes.ok) {
      const statusData = (await statusRes.json()) as { status_code: string; status?: string }
      console.log(`[Instagram] Processing check #${attempts}: status_code=${statusData.status_code}`)

      if (statusData.status_code === "FINISHED") {
        isReady = true
        break
      } else if (statusData.status_code === "ERROR") {
        throw new Error(`Instagram video processing failed: ${statusData.status || "Unknown error"}`)
      } else if (statusData.status_code === "EXPIRED") {
        throw new Error(`Instagram container expired before publishing.`)
      }
    } else {
      console.warn(`[Instagram] Status check returned ${statusRes.status}, retrying...`)
    }
  }

  if (!isReady) {
    throw new Error(`Timed out waiting for Instagram to process video container ${containerId}.`)
  }

  // 5. Finalize Publish / Schedule
  console.log(`[Instagram] 4/4 Publishing/Scheduling container ${containerId}...`)
  const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      creation_id: containerId,
      access_token: igAccessToken,
    }).toString(),
  })

  if (!publishRes.ok) {
    const errorBody = await publishRes.text()
    throw new Error(`Failed to publish/schedule Instagram Reel: ${publishRes.status} ${publishRes.statusText}\n${errorBody}`)
  }

  const publishData = (await publishRes.json()) as { id: string }
  const mediaId = publishData.id

  console.log(`\n======================================================`)
  console.log(`🎉 INSTAGRAM REEL SUBMISSION COMPLETE`)
  console.log(`======================================================`)
  console.log(`📱 Instagram Media ID: ${mediaId}`)
  if (scheduledUnixSeconds) {
    console.log(`📅 Scheduled for:      ${new Date(scheduledUnixSeconds * 1000).toISOString()}`)
    console.log(`🔒 Status:             Queued for automated publication`)
  } else {
    console.log(`🚀 Status:             Published Live!`)
  }
  console.log(`======================================================\n`)
}

run().catch((err) => {
  console.error(`\n❌ [ERROR] ${err.message}`)
  process.exit(1)
})
