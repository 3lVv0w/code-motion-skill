# Social Media Syndication & Scheduling Guide
**YouTube Studio (Data API v3) & Instagram Reels (Meta Graph API)**

This guide walks you through automatically uploading and scheduling your rendered `code-motion` videos directly to **YouTube Shorts** and **Instagram Reels**.

---

## ⚡ Quick Start

```bash
# 1. Preview and validate metadata without uploading (Dry Run)
cd examples/tutorial
bun run schedule time-zones --dry-run

# 2. Upload and schedule to both platforms for tomorrow 11:30 AM EDT
bun run schedule time-zones

# 3. Or upload to an individual platform
bun run upload:yt time-zones
bun run upload:ig time-zones
```

---

## 🔑 Credential Setup

Add your credentials to `examples/tutorial/.env`:

```ini
# Voiceover
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# YouTube Studio (Data API v3)
YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:8085/oauth2callback

# Instagram Reels (Meta Graph API)
INSTAGRAM_USER_ID=your_instagram_account_id
INSTAGRAM_ACCESS_TOKEN=your_meta_access_token
```

---

## 1. YouTube Data API v3 Setup (2 Minutes)

1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create or select a project (e.g. `Code Motion`).
3. Enable the **YouTube Data API v3**:
   - Go to **APIs & Services > Library** > Search for "YouTube Data API v3" > Click **Enable**.
4. Configure OAuth Consent Screen:
   - Go to **APIs & Services > OAuth consent screen**.
   - Choose **External**, enter your App Name and support email.
   - Add test user: Add your Google / YouTube account email.
5. Create OAuth 2.0 Client ID:
   - Go to **APIs & Services > Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Desktop app** (or **Web application** with Authorized redirect URI: `http://localhost:8085/oauth2callback`).
   - Copy the **Client ID** and **Client Secret** into `examples/tutorial/.env` (or save as `examples/tutorial/client_secrets.json`).
6. First-time Authentication:
   - Run `bun run upload:yt time-zones --auth-only` (or run during regular upload).
   - Your browser will open asking for permission to manage YouTube videos.
   - Click **Allow**.
   - The token will be safely saved locally to `.youtube-token.json` and automatically refreshed whenever needed.

---

## 2. Instagram Reels Setup (2 Minutes)

Instagram Content Publishing requires an **Instagram Professional Account** (Creator or Business) connected to a Facebook Page.

1. Convert Instagram account to Professional:
   - In Instagram app: **Settings > Account type and tools > Switch to professional account**.
   - Connect it to any Facebook Page you manage.
2. Get Meta Access Token & User ID:
   - Visit the [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/).
   - Select your Meta App.
   - In **Permissions**, add:
     - `instagram_basic`
     - `instagram_content_publish`
   - Click **Generate Access Token**.
   - To find your `INSTAGRAM_USER_ID`, query:
     ```
     GET /me/accounts?fields=instagram_business_account
     ```
   - Copy the `id` from `instagram_business_account` and the token into `examples/tutorial/.env`.

---

## 📁 Project Configuration (`social.json`)

Each video project can have a `social.json` inside its folder (e.g. `projects/time-zones/social.json`):

```json
{
  "youtube": {
    "title": "Who Decided What Time It Is? (The Secret 1883 Railroad Plot) #shorts",
    "description": "Ever wonder why noon is noon?...\n\n#shorts #history #timezones",
    "tags": ["time zones", "railroads", "1883", "history", "shorts"],
    "categoryId": "27",
    "privacyStatus": "private",
    "publishAt": "2026-10-26T15:30:00.000Z",
    "selfDeclaredMadeForKids": false
  },
  "instagram": {
    "caption": "Who actually decided what time it is? 🕰️🚂...\n\n#historyfacts #timezones",
    "scheduledPublishTime": "2026-10-26T15:30:00.000Z",
    "thumbOffsetMs": 4000
  },
  "files": {
    "verticalVideo": "out/time-zones-vertical.mp4",
    "landscapeVideo": "out/time-zones.mp4",
    "thumbnail": "out/time-zones-4.png"
  }
}
```

---

## 🎛️ CLI Options & Flags

| Flag | Script | Description |
| :--- | :--- | :--- |
| `--dry-run` | All | Validate credentials, files, and payload without making API calls |
| `--schedule "<ISO>"` | All | Override scheduled release time (e.g. `"2026-10-26T15:30:00Z"`) |
| `--platform <all\|yt\|ig>` | `schedule` | Target specific platform (default: `all`) |
| `--vertical` | `upload:yt` | Use 9:16 vertical video (default for Shorts) |
| `--landscape` | `upload:yt` | Use 16:9 landscape video |
| `--title "<title>"` | `upload:yt` | Override title |
| `--desc "<text>"` | `upload:yt` | Override description |
| `--caption "<text>"` | `upload:ig` | Override caption and hashtags |
| `--thumb-offset <ms>` | `upload:ig` | Millisecond offset for thumbnail frame |
| `--auth-only` | `upload:yt` | Authenticate OAuth and save token only |
