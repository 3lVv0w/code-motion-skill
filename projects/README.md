# Projects

This directory contains your personal, custom, or client video projects created with the `/code-motion` agent skill.

All subdirectories inside `projects/` are ignored by git so that your personal scripts, lyrics, assets, and audio remain strictly local on your machine.

## Structure of a Project

Each project in `projects/<id>/` can contain:
- `visuals.js` — The canvas draw function `draw(ctx, W, H, t)`.
- `score.js` — The Web Audio synthesized sound schedule `scoreSound(k)`.
- `narration.json` — (Optional) Beat-synced voiceover script for Edge TTS or ElevenLabs.
- `explainer.html` — (Optional) Standalone interactive HTML player with scrubber and live Web Audio.
- `storyboard.html` — (Optional) Visual HTML canvas storyboard panels.
- `images/` — (Optional) High-resolution background art or assets.
- `out/` — Rendered MP4 video (`<id>.mp4`), stills (`<id>-<t>.png`), and temporary voice clips (`voice-<id>/`).

## Rendering a Project

From `examples/tutorial/`:

```bash
# 1. Generate Voiceover (if narration.json is present)
bun run voiceover <id>

# 2. Preview in Remotion Studio
bun run render <id> --audio
bun run studio

# 3. Render Final MP4
bun run render <id>

# 4. Extract Stills
bun run stills <id> <t1> <t2> ...
```
