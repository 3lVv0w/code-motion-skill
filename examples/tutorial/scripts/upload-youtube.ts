import { createServer } from "node:http"
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { exec } from "node:child_process"
import { loadSocialConfig, loadSocialEnv, parseArgs } from "./social-utils"

const root = join(import.meta.dir, "..")
loadSocialEnv(root)

const { flags, positional } = parseArgs(process.argv.slice(2))
const id = positional[0]

if (!id) {
  console.log(`
Usage: bun run upload:yt <projectId> [options]

Options:
  --vertical           Upload vertical video (default: true for Shorts)
  --landscape          Upload 16:9 landscape video
  --schedule <time>    Schedule release time (ISO 8601, e.g. 2026-10-26T15:30:00Z)
  --title "<title>"    Override title
  --desc "<text>"      Override description
  --privacy <status>   private | public | unlisted (must be private if scheduled)
  --dry-run            Validate credentials, files, and payload without uploading
  --auth-only          Run OAuth authorization flow and save token only

Examples:
  bun run upload:yt time-zones --dry-run
  bun run upload:yt time-zones --schedule "2026-10-26T15:30:00Z"
`)
  process.exit(0)
}

const { config, projectDir } = loadSocialConfig(root, id)
const tokenPath = join(root, ".youtube-token.json")

// Load OAuth Client Credentials
let clientId = process.env.YOUTUBE_CLIENT_ID
let clientSecret = process.env.YOUTUBE_CLIENT_SECRET
const redirectUri = process.env.YOUTUBE_REDIRECT_URI || "http://localhost:8085/oauth2callback"

// Check for client_secrets.json fallback
const clientSecretsPath = join(root, "client_secrets.json")
if ((!clientId || !clientSecret) && existsSync(clientSecretsPath)) {
  try {
    const raw = JSON.parse(readFileSync(clientSecretsPath, "utf8"))
    const creds = raw.installed || raw.web || raw
    clientId = creds.client_id
    clientSecret = creds.client_secret
  } catch (err) {
    console.warn(`[WARN] Failed to read ${clientSecretsPath}:`, err)
  }
}

async function getValidAccessToken(): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error(
      `YouTube OAuth credentials missing!\n` +
      `Please set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in examples/tutorial/.env\n` +
      `or place client_secrets.json in examples/tutorial/\n\n` +
      `To generate credentials: Go to https://console.cloud.google.com/apis/credentials\n` +
      `Create OAuth 2.0 Client ID (Application type: Desktop App or Web App with redirect URI ${redirectUri}).`
    )
  }

  // 1. Check existing token file
  if (existsSync(tokenPath)) {
    try {
      const tokenData = JSON.parse(readFileSync(tokenPath, "utf8"))
      const now = Date.now()
      // If valid for at least 60 seconds
      if (tokenData.access_token && tokenData.expiry_date && tokenData.expiry_date > now + 60000) {
        return tokenData.access_token
      }

      // If refresh token exists, refresh
      if (tokenData.refresh_token) {
        console.log(`[YouTube] Refreshing expired access token...`)
        const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: tokenData.refresh_token,
            grant_type: "refresh_token",
          }).toString(),
        })

        if (refreshRes.ok) {
          const fresh = await refreshRes.json()
          tokenData.access_token = fresh.access_token
          tokenData.expiry_date = Date.now() + fresh.expires_in * 1000
          writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2))
          console.log(`[YouTube] Token refreshed successfully.`)
          return tokenData.access_token
        } else {
          const errText = await refreshRes.text()
          console.warn(`[YouTube] Token refresh failed (${errText}), re-authenticating...`)
        }
      }
    } catch (err) {
      console.warn(`[YouTube] Existing token invalid, re-authenticating...`)
    }
  }

  // 2. Interactive OAuth Flow
  console.log(`\n======================================================`)
  console.log(`🔑 YouTube Studio OAuth 2.0 Authorization Required`)
  console.log(`======================================================`)

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
  ]
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    }).toString()

  return new Promise<string>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url || "/", `http://${req.headers.host}`)
        if (reqUrl.pathname === "/oauth2callback") {
          const code = reqUrl.searchParams.get("code")
          if (!code) {
            res.writeHead(400, { "Content-Type": "text/plain" })
            res.end("Missing auth code in query string.")
            return
          }

          console.log(`[YouTube] Exchanging authorization code for tokens...`)
          const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              code,
              client_id: clientId!,
              client_secret: clientSecret!,
              redirect_uri: redirectUri,
              grant_type: "authorization_code",
            }).toString(),
          })

          if (!tokenRes.ok) {
            const err = await tokenRes.text()
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.end(`Failed to exchange token: ${err}`)
            server.close()
            reject(new Error(err))
            return
          }

          const tokens = await tokenRes.json()
          tokens.expiry_date = Date.now() + tokens.expires_in * 1000
          writeFileSync(tokenPath, JSON.stringify(tokens, null, 2))

          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
          res.end(`
            <html>
              <body style="font-family: system-ui, sans-serif; text-align: center; padding: 60px; background: #0f0f0f; color: #fff;">
                <h1 style="color: #4ade80;">🎉 Authorization Successful!</h1>
                <p style="font-size: 18px; color: #aaa;">Your YouTube Studio credentials have been saved.</p>
                <p>You can close this tab and return to your terminal.</p>
              </body>
            </html>
          `)
          server.close()
          console.log(`[YouTube] ✅ Authorization complete. Tokens saved to .youtube-token.json\n`)
          resolve(tokens.access_token)
        }
      } catch (e) {
        server.close()
        reject(e)
      }
    })

    server.listen(8085, () => {
      console.log(`\n👉 Authorize here:\n${authUrl}\n`)
      console.log(`Attempting to open your default browser automatically...`)
      if (process.platform === "darwin") {
        exec(`open "${authUrl}"`)
      } else if (process.platform === "win32") {
        exec(`start "" "${authUrl}"`)
      } else {
        exec(`xdg-open "${authUrl}"`)
      }
    })
  })
}

async function run() {
  if (flags["auth-only"]) {
    console.log(`[YouTube] Running authorization-only flow...`)
    await getValidAccessToken()
    console.log(`[YouTube] Authorization verified and token ready.`)
    process.exit(0)
  }

  // 1. Resolve Video File Path
  const isLandscape = Boolean(flags.landscape)
  const isVertical = Boolean(flags.vertical) || !isLandscape
  const relativeVideo = isVertical
    ? config.files?.verticalVideo || `out/${id}-vertical.mp4`
    : config.files?.landscapeVideo || `out/${id}.mp4`

  const videoPath = join(projectDir, relativeVideo)
  if (!existsSync(videoPath)) {
    throw new Error(
      `Video file not found at: ${videoPath}\n` +
      `Please render the video first using: bun run render ${id}${isVertical ? "-vertical" : ""}`
    )
  }

  const fileSize = statSync(videoPath).size

  // 2. Resolve Metadata
  const title = (flags.title as string) || config.youtube?.title || `${id} #shorts`
  const description = (flags.desc as string) || (flags.description as string) || config.youtube?.description || ""
  const tags = flags.tags ? (flags.tags as string).split(",").map((s) => s.trim()) : config.youtube?.tags || []
  const categoryId = config.youtube?.categoryId || "27"
  const scheduleTime = (flags.schedule as string) || config.youtube?.publishAt

  let privacyStatus = (flags.privacy as "public" | "private" | "unlisted") || config.youtube?.privacyStatus || "private"
  if (scheduleTime) {
    // YouTube API requirement: scheduled videos must be private
    privacyStatus = "private"
  }

  const snippet = {
    title,
    description,
    tags,
    categoryId,
    defaultLanguage: "en",
  }

  const status: Record<string, any> = {
    privacyStatus,
    selfDeclaredMadeForKids: Boolean(config.youtube?.selfDeclaredMadeForKids),
  }

  if (scheduleTime) {
    status.publishAt = new Date(scheduleTime).toISOString()
  }

  const payload = { snippet, status }

  console.log(`\n======================================================`)
  console.log(`🎬 YouTube Studio Submission & Scheduling: ${id}`)
  console.log(`======================================================`)
  console.log(`📹 Video: ${videoPath} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`)
  console.log(`📐 Aspect: ${isVertical ? "9:16 Vertical (Shorts)" : "16:9 Landscape"}`)
  console.log(`🏷️ Title: "${title}"`)
  console.log(`🔒 Privacy: ${privacyStatus}`)
  if (status.publishAt) {
    console.log(`⏰ Scheduled Publish Time: ${status.publishAt}`)
    const localDate = new Date(status.publishAt).toLocaleString()
    console.log(`   (Local Time: ${localDate})`)
  }

  if (flags["dry-run"]) {
    console.log(`\n🔍 [DRY RUN] Request Payload:`)
    console.log(JSON.stringify(payload, null, 2))
    console.log(`\nOAuth Credentials check:`)
    console.log(`- Client ID: ${clientId ? "✅ Present (" + clientId.slice(0, 12) + "...)" : "❌ Missing"}`)
    console.log(`- Client Secret: ${clientSecret ? "✅ Present" : "❌ Missing"}`)
    console.log(`- Stored Token: ${existsSync(tokenPath) ? "✅ Present (.youtube-token.json)" : "⚠️ Not yet generated"}`)
    console.log(`\n✅ Dry-run complete. Everything is configured and ready for live upload.`)
    return
  }

  // 3. Authenticate
  const accessToken = await getValidAccessToken()

  // 4. Initiate Resumable Upload
  console.log(`\n[YouTube] 1/3 Initializing resumable upload session...`)
  const initRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(fileSize),
      "X-Upload-Content-Type": "video/mp4",
    },
    body: JSON.stringify(payload),
  })

  if (!initRes.ok) {
    const errorBody = await initRes.text()
    throw new Error(`Failed to initiate YouTube upload session: ${initRes.status} ${initRes.statusText}\n${errorBody}`)
  }

  const uploadUrl = initRes.headers.get("location")
  if (!uploadUrl) {
    throw new Error(`YouTube did not return a resumable upload location header.`)
  }

  // 5. Stream Video Chunks
  console.log(`[YouTube] 2/3 Uploading video binary (${(fileSize / (1024 * 1024)).toFixed(2)} MB)...`)
  const videoBuffer = readFileSync(videoPath)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Length": String(fileSize),
      "Content-Type": "video/mp4",
    },
    body: videoBuffer,
  })

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text()
    throw new Error(`Failed to upload video binary: ${uploadRes.status} ${uploadRes.statusText}\n${errorBody}`)
  }

  const videoData = await uploadRes.json()
  const videoId = videoData.id
  console.log(`[YouTube] ✅ Video uploaded successfully! Video ID: ${videoId}`)

  // 6. Upload Custom Thumbnail (if available)
  const relativeThumb = config.files?.thumbnail || `out/${id}-4.png`
  const thumbPath = join(projectDir, relativeThumb)
  if (existsSync(thumbPath)) {
    console.log(`[YouTube] 3/3 Uploading custom thumbnail from ${relativeThumb}...`)
    try {
      const thumbBuffer = readFileSync(thumbPath)
      const thumbRes = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/png",
        },
        body: thumbBuffer,
      })
      if (thumbRes.ok) {
        console.log(`[YouTube] ✅ Thumbnail uploaded successfully.`)
      } else {
        const thumbErr = await thumbRes.text()
        console.warn(`[YouTube] ⚠️ Thumbnail upload returned ${thumbRes.status}: ${thumbErr}`)
      }
    } catch (tErr) {
      console.warn(`[YouTube] ⚠️ Thumbnail upload error:`, tErr)
    }
  } else {
    console.log(`[YouTube] 3/3 No custom thumbnail found at ${thumbPath}, using default frame.`)
  }

  // 7. Output Final Summary
  console.log(`\n======================================================`)
  console.log(`🎉 YOUTUBE SUBMISSION COMPLETE`)
  console.log(`======================================================`)
  console.log(`🔗 Watch URL:   https://youtu.be/${videoId}`)
  if (isVertical) {
    console.log(`📱 Shorts URL:  https://youtube.com/shorts/${videoId}`)
  }
  console.log(`⚙️ Studio Edit: https://studio.youtube.com/video/${videoId}/edit`)
  if (status.publishAt) {
    console.log(`📅 Scheduled for: ${status.publishAt}`)
    console.log(`🔒 Current Privacy: private (will switch to public automatically)`)
  }
  console.log(`======================================================\n`)
}

run().catch((err) => {
  console.error(`\n❌ [ERROR] ${err.message}`)
  process.exit(1)
})
