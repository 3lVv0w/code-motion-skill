# คู่มือการสร้าง Music Video (MV) จากเพลง Suno ด้วย Code-Motion

คู่มือนี้สรุปขั้นตอนทั้งหมดในการสร้าง **Music Video (MV) สไตล์ AI Background Art + Kinetic Lyrics & Beat-Sync** ในสัดส่วน 9:16 (TikTok, Reels, Shorts) หรือ 16:9 (YouTube) โดยใช้เพลงที่แต่งจาก Suno AI

---

## 🏗️ โครงสร้างของระบบ Music Video
 
ระบบ MV ถูกออกแบบให้แยกเลเยอร์ชัดเจนเพื่อให้ปรับแต่งและสลับเพลงได้ง่าย:

```
examples/tutorial/
├── public/
│   ├── <video-id>-music.mp3       # ไฟล์เพลง Master จาก Suno (gitignored)
│   └── images/<video-id>/         # ภาพ AI Background (scene1.jpg, scene2.jpg...)
└── src/
    └── videos/
        ├── index.ts               # ทะเบียนรวมวิดีโอ (Video Registry)
        └── <video-id>/            # โฟลเดอร์สคริปต์ของวิดีโอ
            ├── lyrics.json        # ตารางเวลาเนื้อเพลงและฉาก
            ├── music-video.js     # ตัวช่วย Beat-sync, Ken Burns, Lighting, Typography
            └── visuals.js         # ลอจิกการวาดแคนวาสและการควบคุมฉาก
```

> **ข้อกำหนด Git Hygiene**: ไฟล์สื่อที่ถูกสร้างทั้งหมด ทั้งไฟล์เสียง (`*.mp3`, `*.wav`) และไฟล์วิดีโอเรนเดอร์ (`out/*.mp4`) ถูกยกเว้นจาก Git ผ่าน `.gitignore` เพื่อรักษาความกะทัดรัดและสะอาดของ repository

---

## 🚀 ขั้นตอนการสร้างทีละขั้นตอน (Step-by-Step)

### ขั้นตอนที่ 1: เตรียมไฟล์เพลงจาก Suno
1. เข้าไปที่ Suno AI แล้วกด **Download Audio** (ไฟล์ `.mp3` หรือ `.wav`)
2. เช็คค่า **BPM** ของเพลง (เช่น 120, 95, 140) จากข้อมูลใน Suno
3. นำไฟล์เพลงไปวางใน:
   ```bash
   examples/tutorial/public/<video-id>-music.mp3
   ```

---

### ขั้นตอนที่ 2: เตรียมเนื้อเพลงและช่วงเวลา (Lyrics & Timestamps)
กำหนดช่วงเวลาของแต่ละท่อนในไฟล์ `lyrics.json`:

```json
{
  "title": "ชื่อเพลง",
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
      "text": "คืนที่เงียบงันใต้แสงจันทร์",
      "subText": "Silent night beneath the moon"
    },
    {
      "start": 12.0,
      "end": 18.5,
      "section": "VERSE 1",
      "text": "มีเพียงเสียงเพลงนำทางเราไป",
      "subText": "Only melody guiding our way"
    },
    {
      "start": 28.0,
      "end": 36.0,
      "section": "CHORUS",
      "text": "ระเบิดความฝันให้ก้องกังวาน!",
      "subText": "Let our dreams echo through the sky!"
    }
  ]
}
```

> **ทิป**: หากต้องการดึง timestamps อัตโนมัติ สามารถใช้ OpenAI Whisper transcribe คำร้องได้:
> ```bash
> whisper public/my-song-music.mp3 --output_format json
> ```

---

### ขั้นตอนที่ 3: สร้างภาพประกอบ AI (AI Background Art)
เจนภาพด้วยสัดส่วน **9:16** (สำหรับแนวตั้ง) หรือ **16:9** (สำหรับแนวนอน) ตามอารมณ์ของแต่ละท่อนเพลง:

- **Scene 1 (Intro / Hook)**: บรรยากาศเปิดเรื่อง แสงนุ่มนวล หรือถนนนีออนฝนพรำ
- **Scene 2 (Verse)**: ตัวละครเหม่อมองท้องฟ้า ระเบียงตึก หรือการเดินทาง
- **Scene 3 (Chorus / Climax)**: อารมณ์พุ่งพล่าน ท้องฟ้าเปิด แสงออโรร่า หรือกลีบดอกไม้ลอยในอวกาศ

นำภาพไปบันทึกที่:
```bash
examples/tutorial/public/images/<video-id>/scene1.jpg
examples/tutorial/public/images/<video-id>/scene2.jpg
examples/tutorial/public/images/<video-id>/scene3.jpg
```

---

### ขั้นตอนที่ 4: การทำงานของ Music Video Engine (`music-video.js`)

ตัวช่วย `window.MV` ให้ความสามารถระดับมืออาชีพโดยไม่ต้องเขียนโค้ดคณิตศาสตร์ซับซ้อน:

1. **`MV.beat(t, bpm)`**:
   - คำนวณจังหวะตกของกลอง/เบสแบบเสี้ยววินาที
   - ให้ค่า `pulse` (1.0 -> 0.0) สำหรับการเด้งของภาพ แสงแฟลช และตัวหนังสือ
2. **`MV.drawKenBurns(ctx, img, w, h, t, startT, dur, motion, pulse, alpha)`**:
   - ปรับการขยับกล้องแบบภาพยนตร์ (`zoom-in`, `zoom-out`, `pan-left`, `pan-right`, `pan-up`)
   - รองรับการทำ Crossfade สลับฉากอย่างนุ่มนวล
3. **`MV.drawAtmosphere(ctx, w, h, t, pulse)`**:
   - ใส่ขอบดำ Vignette อัตโนมัติ
   - มีฝุ่นละอองแสง (Floating Dust / Embers) เคลื่อนไหวสมจริง
   - มีไฟกระพริบตามจังหวะเบส
4. **`MV.drawLyrics(ctx, w, h, t, lyrics, bpm, pulse)`**:
   - ตัวหนังสือเด้ง Slide-up & Fade-in อัตโนมัติ
   - ป้ายบอกท่อนเพลงทรง Pill (`[ INTRO ]`, `[ VERSE 1 ]`, `[ CHORUS ]`) สีนีออน
   - คลื่นเสียง EQ Waveform เต้นอยู่แถบล่าง

---

### ขั้นตอนที่ 5: พรีวิวและเรนเดอร์

1. **พรีวิวแบบเรียลไทม์ในเบราว์เซอร์**:
   ```bash
   bun run studio
   ```
   *(สามารถกด Play, Scrub ไทม์ไลน์ และดูจังหวะตัวหนังสือพร้อมฟังเพลงได้ทันที)*

2. **เรนเดอร์ไฟล์วิดีโอ MP4**:
   ```bash
   bun run render <video-id>
   ```
   ไฟล์ผลลัพธ์จะถูกบันทึกที่:
   ```bash
   examples/tutorial/out/<video-id>.mp4
   ```
