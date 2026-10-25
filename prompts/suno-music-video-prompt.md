# Prompt for Generating Suno AI Music Videos with Code-Motion

Use this prompt template when asking an AI assistant to generate a complete Music Video (MV) in `code-motion` from your Suno song.

---

```markdown
I have a song generated from Suno AI and I want to create a high-quality vertical 9:16 Music Video (MV) using `code-motion`.

### 1. Song Details
- Title: [e.g. Neon City Romance]
- Artist: [e.g. My Suno Band]
- Genre / Mood: [e.g. Synthwave / Cyberpunk / Emotional Pop]
- BPM: [e.g. 120]
- Duration: [e.g. 60 seconds]
- Audio File: placed at `public/<video-id>-music.mp3`

### 2. Lyrics & Sections
- [0:00 - 0:10] [INTRO]: "..." (Subtext / Thai: "...")
- [0:10 - 0:25] [VERSE 1]: "..." (Subtext / Thai: "...")
- [0:25 - 0:45] [CHORUS]: "..." (Subtext / Thai: "...")
- [0:45 - 1:00] [OUTRO]: "..." (Subtext / Thai: "...")

### 3. Visual & Aesthetic Requirements
- Format: 9:16 Vertical (1080x1920, 30 FPS or 60 FPS)
- Style: AI Background Art + Kinetic Lyrics & Beat-Sync
- Visual Elements:
  - Smooth Ken Burns camera motion per scene (`zoom-in`, `zoom-out`, `pan-up`)
  - Bass-synced pulse on the kick drum beat (image scale bump, lighting flash)
  - Atmospheric overlays (cinematic vignette, floating dust/ember particles, readable gradient scrims)
  - Kinetic typography with glowing text, neon pill badges (`[ VERSE 1 ]`, `[ CHORUS ]`), and audio equalizer waveform bar.

Please generate:
1. `lyrics.json` with accurate timestamps and scene assignments.
2. `visuals.js` implementing the canvas render logic using `window.MV`.
3. Image generation prompts for each scene so I can generate 9:16 scenic backgrounds.

Place the files inside `src/videos/<video-id>/`, and register it in `src/videos/index.ts`.
```

