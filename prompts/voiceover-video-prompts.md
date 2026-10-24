# Example prompts: videos with voiceover

Copy a prompt, fill in the brackets, and send it to your coding agent with the `code-motion` skill
installed (Claude Code, Codex, Cursor, Antigravity…), or to Claude Desktop with
[claude-desktop-prompt.md](claude-desktop-prompt.md) as project instructions.

Every prompt asks for the storyboard and transcript **first**. Approve or correct them before any
code is written. Changing a sentence is free at that stage and slow afterwards.

## What to specify

| Field        | Options                                                        | Why it matters |
| ------------ | -------------------------------------------------------------- | -------------- |
| Topic + goal | what it is about, who watches it, what they should remember     | Drives the beats |
| Duration     | 15–30 s promo, 60–90 s explainer, 120 s mini-documentary        | Sets how many words fit (table below) |
| Format       | 16:9 1920×1080 (YouTube, decks) · 9:16 1080×1920 (Reels, Shorts, TikTok) · both | Layout is designed per format |
| FPS          | 30 (default, smaller files) · 60 (smooth motion, double render time) | Set per video |
| Language     | English, Thai, …                                               | Picks the voice and the fonts |
| Voice style  | gender, accent, tone (documentary, news, warm, casual)          | Picks the voice; see table below |
| Visual style | an AI Style Atlas style name, or palette + mood                | The look |
| Sensitivity  | anything to handle with restraint                              | Keeps tone right |

### How many words fit

Narration must end before its scene does. At normal speed:

| Duration | English (≈2.2 words/s, minus pauses) | Thai (≈4–5 syllables/s) |
| -------- | ------------------------------------ | ----------------------- |
| 15 s     | ~30 words                            | ~60 syllables           |
| 30 s     | ~60 words                            | ~120 syllables          |
| 60 s     | ~120 words                           | ~240 syllables          |
| 90 s     | ~180 words                           | ~360 syllables          |
| 120 s    | ~240 words                           | ~480 syllables          |

`bun run voiceover <id>` refuses to finish if a beat runs long, so the agent will tell you.

### Voice styles

| Style                        | Edge TTS voice (free)                               | ElevenLabs model (with `ELEVENLABS_API_KEY`) |
| ---------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Documentary, authoritative   | `en-US-ChristopherNeural`, `en-GB-RyanNeural` (M) · `en-GB-SoniaNeural` (F) | `eleven_multilingual_v2` |
| News, confident              | `en-US-GuyNeural` (M) · `en-US-AriaNeural` (F)      | `eleven_multilingual_v2` |
| Warm product explainer       | `en-US-AndrewNeural` (M) · `en-US-AvaNeural`, `en-US-EmmaNeural` (F) | `eleven_multilingual_v2` |
| Casual social clip           | `en-US-BrianNeural`, `en-US-RogerNeural` (M) · `en-US-JennyNeural` (F) | `eleven_v3` (more expressive) |
| Thai                         | `th-TH-NiwatNeural` (M) · `th-TH-PremwadeeNeural` (F) | `eleven_v3` (`multilingual_v2` has no Thai) |

---

## Template

```text
/code-motion Make a video with voiceover.

- Topic: [what it is about]
- Audience and goal: [who watches it, what they should remember]
- Duration: [e.g. 60] seconds
- Format: [9:16 1080x1920 | 16:9 1920x1080 | both]
- FPS: [30 | 60]
- Language: [English | Thai | ...]
- Voice: [style, gender, accent], e.g. [en-GB-RyanNeural]. Use ElevenLabs [model] if my key is set.
- Visual style: [AI Style Atlas style name, or palette and mood]
- Handle with care: [sensitive topics, or "none"]

First, show me the storyboard: one panel per beat (6–10 beats) with the time range, on-screen
text, visuals, sound cues, and the exact narration for that beat. Keep each beat's narration
short enough to finish inside the beat. Wait for my approval before writing code.
After approval: build it, generate the voiceover per beat, check stills, and render the MP4.
```

---

## Examples

### 1. Mini-documentary · English · 9:16 · 60 fps · 120 s

```text
/code-motion Make a 120-second vertical video about the history of the Apollo program.

- Audience: curious viewers on Reels and YouTube Shorts; they should remember the key missions
  and why Apollo 11 mattered
- Format: 9:16, 1080x1920, 60 fps
- Language: English
- Voice: calm, authoritative British male documentary narrator (en-GB-RyanNeural)
- Visual style: archival film look, sepia and off-white, abstract maps and diagrams, no photos
- 10 beats of about 12 seconds each, narration at most ~25 words per beat

Show me the storyboard and full transcript first and wait for my approval.
```

### 2. Product explainer · English · 16:9 + 9:16 · 30 fps · 30 s

```text
/code-motion Make a 30-second explainer for our app, in both 16:9 (1920x1080) and 9:16 (1080x1920),
30 fps.

- Take the features and wording from this repo's README and docs, not from memory
- Use our real logo from public/logo.svg
- Voice: warm, friendly American female (en-US-AvaNeural); ElevenLabs eleven_multilingual_v2
  if my key is set
- Visual style: [AI Style Atlas style name]
- 6 beats; the last beat is a call to action with the URL on screen

Storyboard with narration per beat first, then wait for my approval.
```

### 3. History explainer · Thai · 9:16 · 30 fps · 90 s

```text
/code-motion ทำวิดีโอแนวตั้ง 9:16 (1080x1920) 30 fps ความยาว 90 วินาที เรื่องประวัติศาสตร์กรุงศรีอยุธยา

- ผู้ชม: คนทั่วไปบน Reels / TikTok ดูจบแล้วจำเหตุการณ์สำคัญได้
- ภาษา: ไทย พร้อมข้อความบนจอภาษาไทย
- เสียงบรรยาย: ผู้ชาย น้ำเสียงสารคดี สุขุม (th-TH-NiwatNeural)
  ถ้ามี ELEVENLABS_API_KEY ให้ใช้ ElevenLabs model eleven_v3
- สไตล์ภาพ: ทองและแดงชาด ลายไทย แผนที่แบบเรียบ ไม่ใช้ภาพถ่าย
- 9 จังหวะ จังหวะละประมาณ 10 วินาที บทบรรยายไม่เกินราว 45 พยางค์ต่อจังหวะ

ทำสตอรี่บอร์ดพร้อมบทบรรยายทุกจังหวะให้ดูก่อน แล้วรอให้ฉันอนุมัติ
```

### 4. Social teaser · English · 9:16 · 60 fps · 15 s

```text
/code-motion Make a 15-second vertical teaser (1080x1920, 60 fps) announcing [launch / event] on
[date].

- Voice: energetic, casual American male (en-US-RogerNeural); ElevenLabs eleven_v3 if my key is set
- 4 beats: hook (0–3 s), what it is, why it matters, date + call to action
- Narration under 30 words total; big, bold on-screen text that works with the sound off

Storyboard and transcript first, wait for my approval.
```

---

## Which models fit

**The coding agent's model** writes the storyboard, the drawing code, the sound score and the
narration. It needs to be good at long, multi-file code, precise with timings, and careful with
layout. Use the strongest agentic coding model your tool offers: the current top tier from
Anthropic (Claude), Google (Gemini) or OpenAI (GPT). Small, fast models tend to produce text that
overlaps, sounds that don't line up with visuals, and narration too long for its beats. If you
have a choice, use the top model for the storyboard and build, and a cheaper one for small edits.

**The voice model** reads the approved narration:

| Need                                  | Use                                                       |
| ------------------------------------- | --------------------------------------------------------- |
| Free, consistent, good enough for most | Edge TTS neural voices (default, no key)                 |
| Most natural English and European languages | ElevenLabs `eleven_multilingual_v2`                 |
| Most expressive delivery, or Thai      | ElevenLabs `eleven_v3` (listen to each clip; it varies more) |
| Real-time / low latency               | Not needed: narration is generated once, before rendering |

Edge TTS gives the same voice every run, which suits re-rendering. With ElevenLabs, set the voice
ID in `narration.json` (`"elevenlabs": { "voice": "...", "model": "..." }`) so re-runs match.
