# ตัวอย่างวิดีโอ (Example Video Compositions)

[English](README.md) | [ไทย](README.th.md)

โฟลเดอร์นี้รวบรวมตัวอย่างวิดีโอ Remotion ที่สร้างขึ้นด้วยสกิล `/code-motion`:

| รหัส Composition | ชื่อเรื่อง / สไตล์ | ขนาดภาพ | ความยาว | เสียง / เสียงบรรยาย |
|---|---|---|---|---|
| `tutorial` | **วิดีโอสอนการใช้งานสกิล** (Manga Page) | 1280×720 (16:9) | 34.0 วินาที | เสียงเอฟเฟกต์สังเคราะห์ + เสียงพากย์เสริม |
| `tutorial-vertical` | **วิดีโอสอนการใช้งานสกิล** (แนวตั้ง) | 1080×1920 (9:16) | 34.0 วินาที | เสียงเอฟเฟกต์สังเคราะห์ + เสียงพากย์เสริม |
| `launch` | **เทรลเลอร์เปิดตัวผลิตภัณฑ์** (Popular Looks) | 1920×1080 (16:9) | 25.0 วินาที | เสียงเอฟเฟกต์สังเคราะห์ + เสียงบรรยาย |
| `launch-vertical` | **เทรลเลอร์เปิดตัวผลิตภัณฑ์** (แนวตั้ง) | 1080×1920 (9:16) | 25.0 วินาที | เสียงเอฟเฟกต์สังเคราะห์ + เสียงบรรยาย |

---

## ขั้นตอนการเรนเดอร์อย่างรวดเร็ว

### 1. ติดตั้ง Dependencies
```bash
bun install
```

### 2. สร้างเสียงบรรยาย (ไม่บังคับ)
สำหรับวิดีโอที่มีเสียงพากย์ (เช่น `launch` หรือ `tutorial`):
```bash
bun run voiceover launch

# สั่งสร้างด้วย ElevenLabs (เมื่อตั้งค่า ELEVENLABS_API_KEY ใน .env)
bun run voiceover launch --engine elevenlabs
```

### 3. เปิดดูใน Remotion Studio
คุณสามารถเลื่อนดูทีละเฟรมและฟังเสียงไปพร้อมกันแบบ Real-time:
```bash
# เรนเดอร์เสียงสังเคราะห์สำหรับ Studio ก่อน
bun run render tutorial --audio

# เปิด Remotion Studio ที่ http://localhost:3000
bun run studio
```

### 4. เรนเดอร์เป็นไฟล์ MP4
```bash
# เรนเดอร์วิดีโอสอนการใช้งานหลัก
bun run render tutorial                      # ผลลัพธ์: out/tutorial.mp4
bun run render tutorial-vertical             # ผลลัพธ์: out/tutorial-vertical.mp4

# เรนเดอร์วิดีโอเปิดตัวผลิตภัณฑ์
bun run render launch                        # ผลลัพธ์: out/launch.mp4
bun run render launch-vertical               # ผลลัพธ์: out/launch-vertical.mp4
```

### 5. สกัดภาพนิ่งเพื่อตรวจสอบ
```bash
bun run stills tutorial 0 5 12 20 28 34
bun run stills launch 0 4.9 11.3 17.8 25.6 31.8
```


---

## นโยบาย Git: ไฟล์ที่สร้างขึ้น vs โค้ดหลัก

- **ไม่บันทึกลง Git โดยเด็ดขาด (กำหนดไว้ใน `.gitignore`):**
  - `out/` และไฟล์ `*.mp4` ทั้งหมด
  - `public/*.wav` และ `*.wav` ทั้งหมด
  - `public/*.mp3` และ `*.mp3` ทั้งหมด
  - ไฟล์ `.env`
  - โฟลเดอร์ `.remotion/`
- **บันทึกลง Git เสมอ (โค้ดหลักของสกิล):**
  - `src/lib/` (`harness.js`, `sound.js`)
  - `src/style/` (`voxel.js`, `manga.js`, `blueprint.js`)
  - `src/videos/` (ตัวอย่างมาตรฐานของ repo: `tutorial/`, `launch/`)
  - `scripts/` (`render.ts`, `voiceover.ts`, `stills.ts`)
  - `public/fonts/` (ฟอนต์ที่มีสัญญาอนุญาต OFL)

