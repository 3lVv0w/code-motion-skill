# Suno Music Video Creation Guide with Code-Motion

This guide explains how to produce production-grade **Music Videos (MV)** featuring **AI Background Art + Kinetic Lyrics & Beat-Sync** in 9:16 (TikTok, Reels, Shorts) or 16:9 (YouTube) format using songs generated from Suno AI.

---

## 🏗️ Architecture Overview

The MV architecture cleanly decouples the song audio, scenic backgrounds, lyrics timestamps, and motion rendering:

```
examples/tutorial/
├── public/
│   ├── <video-id>-music.mp3       # Suno Master Audio Track (gitignored)
│   └── images/<video-id>/         # AI Background scenes (scene1.jpg, scene2.jpg...)
└── src/
    └── videos/
        ├── index.ts               # Video registry
        └── <video-id>/            # Video composition scripts
            ├── lyrics.json        # Timestamped lyrics and scene sequence
            ├── music-video.js     # Beat-sync, Ken Burns, lighting & typography helper
            └── visuals.js         # Canvas render function & video definition
```

> **Git Hygiene Notice**: All generated media files, audio tracks (`*.mp3`, `*.wav`), and rendered video outputs (`out/*.mp4`) are excluded by `.gitignore` to keep the repository lightweight.

---

## 🚀 Step-by-Step Workflow

### Step 1: Export Audio from Suno
1. Download the track from Suno AI as `.mp3` or `.wav`.
2. Note the track's **BPM** (tempo) displayed in Suno (e.g. 120, 95, 140).
3. Place the file into:
   ```bash
   examples/tutorial/public/<video-id>-music.mp3
   ```

---

### Step 2: Configure Lyrics & Timestamps
Structure the lyric timeline and scenic transitions in `lyrics.json`:

```json
{
  "title": "Song Title",
  "bpm": 120,
  "duration": 60,
  "music": "my-song-music.mp3",
  "scenes": [
    { "start": 0, "end": 12.0, "image": "images/my-song/scene1.jpg", "motion": "zoom-in" },
    { "start": 12.0, "end": 28.0, "image": "images/my-song/scene2.jpg", "motion": "pan-up" },
    { "start": 28.0, "end": 45.0, "image": "images/my-song/scene3.jpg", "motion": "zoom-in" }
  ],
  "lyrics": [
    {
      "start": 1.5,
      "end": 6.0,
      "section": "INTRO",
      "text": "Lost in the Neon Rain",
      "subText": "ค่ำคืนท่ามกลางแสงไฟนีออน"
    },
    {
      "start": 12.0,
      "end": 18.5,
      "section": "VERSE 1",
      "text": "Searching for stars above the city",
      "subText": "เฝ้ามองหาดวงดาวเหนือเมืองใหญ่"
    },
    {
      "start": 28.0,
      "end": 36.0,
      "section": "CHORUS",
      "text": "We ignite the eternal light!",
      "subText": "จุดประกายแสงสว่างชั่วนิรันดร์"
    }
  ]
}
```

> **Tip**: You can use OpenAI Whisper to generate automated phrase timestamps:
> ```bash
> whisper public/my-song-music.mp3 --output_format json
> ```

---

### Step 3: Generate Scenic AI Backgrounds
Generate vertical 9:16 or horizontal 16:9 images matching each song section:

- **Scene 1 (Intro)**: Atmospheric opening, neon reflections, rainy streets, or gentle ambient lighting.
- **Scene 2 (Verse)**: Introspective mood, city balcony overlook, expansive landscapes.
- **Scene 3 (Chorus)**: High-energy climax, cosmic aura, auroras, floating light petals.

Save images into:
```bash
examples/tutorial/public/images/<video-id>/scene1.jpg
examples/tutorial/public/images/<video-id>/scene2.jpg
examples/tutorial/public/images/<video-id>/scene3.jpg
```

---

### Step 4: Music Video Engine Capabilities (`music-video.js`)

The `window.MV` helper provides production-ready effects:

1. **`MV.beat(t, bpm)`**:
   - Calculates real-time beat phase and kick drum impact `pulse` (1.0 -> 0.0)
   - Drives subtle camera zoom punches, lighting flashes, and typography scale snaps.
2. **`MV.drawKenBurns(ctx, img, w, h, t, startT, dur, motion, pulse, alpha)`**:
   - Cinematic camera motions (`zoom-in`, `zoom-out`, `pan-left`, `pan-right`, `pan-up`)
   - Handles aspect-ratio cover and smooth cross-fading between scenes.
3. **`MV.drawAtmosphere(ctx, w, h, t, pulse)`**:
   - Top and bottom gradient scrims for maximum text readability.
   - Dynamic cinematic vignette and floating dust / ember particles.
4. **`MV.drawLyrics(ctx, w, h, t, lyrics, bpm, pulse)`**:
   - Snappy slide-up and fade-in entrances.
   - Glowing neon pill section badges (`[ INTRO ]`, `[ VERSE 1 ]`, `[ CHORUS ]`).
   - Dual-language support (English main lyric + Thai subtext in Mali font).
   - Social media safe-zone audio equalizer waveform bar.

---

### Step 5: Preview & Render

1. **Interactive Browser Preview**:
   ```bash
   bun run studio
   ```

2. **Render Final MP4 Video**:
   ```bash
   bun run render <video-id>
   ```
   Output will be generated at:
   ```bash
   examples/tutorial/out/<video-id>.mp4
   ```
