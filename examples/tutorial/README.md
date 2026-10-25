# Example Video Compositions

[English](README.md) | [ไทย](README.th.md)

This directory contains full Remotion video compositions built using the `/code-motion` agent skill:

| ID | Title / Style | Resolution | Duration | Audio / Narration |
|---|---|---|---|---|
| `tutorial` | **Code Motion Skill Tutorial** (Manga Page) | 1280×720 (16:9) | 34.0s | Synthesized SFX + Optional Voiceover |
| `tutorial-vertical` | **Code Motion Skill Tutorial** (Vertical) | 1080×1920 (9:16) | 34.0s | Synthesized SFX + Optional Voiceover |
| `launch` | **Product Launch Reveal** (Popular Looks) | 1920×1080 (16:9) | 25.0s | Synthesized SFX + Voiceover |
| `launch-vertical` | **Product Launch Reveal** (Vertical) | 1080×1920 (9:16) | 25.0s | Synthesized SFX + Voiceover |

---

## Quick Start: Rendering Videos

### 1. Install Dependencies
```bash
bun install
```

### 2. Generate Voiceover (Optional)
For videos using narration (such as `launch` or `tutorial`):
```bash
bun run voiceover launch

# With ElevenLabs (if ELEVENLABS_API_KEY is set in .env)
bun run voiceover launch --engine elevenlabs
```

### 3. Preview in Remotion Studio
Scrub every frame and listen to audio in real time:
```bash
# Render synthesized audio score first
bun run render tutorial --audio

# Launch Remotion Studio at http://localhost:3000
bun run studio
```

### 4. Render Final Video (MP4)
```bash
# Render canonical tutorial
bun run render tutorial                      # Output: out/tutorial.mp4
bun run render tutorial-vertical             # Output: out/tutorial-vertical.mp4

# Render product launch trailer
bun run render launch                        # Output: out/launch.mp4
bun run render launch-vertical               # Output: out/launch-vertical.mp4
```

### 5. Check Test Stills
```bash
bun run stills tutorial 0 5 12 20 28 34
bun run stills launch 0 4.9 11.3 17.8 25.6 31.8
```


---

## Git Policy: Generated Assets vs. Core Code

- **Never committed to git (ignored by `.gitignore`):**
  - `out/` and `*.mp4` (video renders)
  - `public/*.wav` and `*.wav` (synthesized audio)
  - `public/*.mp3` and `*.mp3` (voiceover and music tracks)
  - `.env` (API keys)
  - `.remotion/` (bundler cache)
- **Always committed (Core code):**
  - `src/lib/` (`harness.js`, `sound.js`)
  - `src/style/` (`voxel.js`, `manga.js`, `blueprint.js`)
  - `src/videos/` (canonical repo examples: `tutorial/`, `launch/`)
  - `scripts/` (`render.ts`, `voiceover.ts`, `stills.ts`)
  - `public/fonts/` (OFL fonts)

