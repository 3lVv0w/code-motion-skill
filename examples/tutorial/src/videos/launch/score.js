// Synthesized sound score for Product Launch Reveal "Introducing code-motion".
// Sounds are synthesized via Web Audio in window.SOUND (src/lib/sound.js).
;(function () {
  'use strict'

  function launchScore(k0) {
    const { T, DURATION, sm, io, eo } = window.LAUNCH
    const sn = (t) => (Math.round(t * 48000) + 0.25) / 48000
    const k = {
      ...k0,
      play: (n, t, o) => k0.play(n, sn(t), o),
      tone: (t, o) => k0.tone(sn(t), o),
      noise: (t, o) => k0.noise(sn(t), o),
      hz: (n) => k0.hz(n),
    }

    const D = DURATION
    const bwoom = (t, g = 1, dur = 1.4, f = 58) => {
      k.tone(t, { f: [[0, f * 1.7], [0.1, f], [dur, f * 0.72]], dur, gain: 0.45 * g, a: 0.012, hold: dur * 0.15 })
      k.tone(t, { f: f * 2, dur: dur * 0.45, gain: 0.06 * g, a: 0.012 })
      k.noise(t, { dur: 0.6, color: 'brown', filter: 'lowpass', f: [[0, 420], [0.6, 80]], gain: 0.2 * g, a: 0.008, verb: 0.25 })
    }
    const air = (t, dur, g = 1) => {
      k.noise(t, { dur, color: 'pink', filter: 'bandpass', f: [[0, 450], [dur, 4200]], q: 0.7, gain: 0.12 * g, a: dur * 0.92, verb: 0.35 })
      k.tone(t, { f: [[0, 'D3'], [dur, 'D4']], type: 'triangle', dur, gain: 0.02 * g, a: dur * 0.9, filter: 'lowpass', f2: 900 })
    }
    const click = (t, g = 1, pan = 0, minor = true) => {
      k.noise(t, { dur: 0.014, filter: 'bandpass', f: 2300, q: 1.6, gain: 0.18 * g, pan, minor })
      k.tone(t, { f: [[0, 420], [0.03, 260]], dur: 0.04, gain: 0.06 * g, pan, minor })
    }
    const glide = (t, dur, g = 1, pan = 0, minor = true) => {
      k.noise(t, { dur, color: 'pink', filter: 'lowpass', f: [[0, 160], [dur * 0.5, 720], [dur, 190]], q: 0.9, gain: 0.22 * g, a: dur * 0.45, pan, verb: 0.15, minor })
    }
    const chord = (t, notes, dur, g = 1, minor = false) => {
      notes.forEach((n, i) => {
        const pan = (i - (notes.length - 1) / 2) * 0.22
        k.tone(t, { f: n, type: 'triangle', dur, gain: 0.045 * g, a: 0.03, hold: dur * 0.3, filter: 'lowpass', f2: [[0, 2200], [dur, 700]], pan, verb: 0.4, minor })
        k.tone(t, { f: k.hz(n) * 1.003, dur, gain: 0.035 * g, a: 0.05, hold: dur * 0.3, pan: -pan, verb: 0.4, minor })
      })
    }
    const ticks = (val, a, b, gap, g = 1, pan = 0) => {
      let last = -1, prev = val(a)
      for (let t = a; t <= b; t += 0.002) {
        const v = val(t)
        if (v !== prev && t - last >= gap) { click(t, g, pan); last = t }
        prev = v
      }
    }

    // ---- music: quiet keynote pad, subtle pulse through middle, pad again for the resolve ----
    const CH = [
      ['D3', 'A3', 'E4', 'F#4'],
      ['B2', 'F#3', 'D4', 'A4'],
      ['G2', 'D3', 'B3', 'F#4'],
      ['A2', 'E3', 'C#4', 'E4'],
    ]
    k0.music('pad', 0.2, 2.85, { bpm: 64, gain: 0.26, chords: [CH[0]] })
    k0.music('pulse', 2.85, 26.45, { bpm: 64, gain: 0.22, chords: [CH[1], CH[2], CH[3]] })
    k0.music('pad', 26.45, D, { bpm: 64, gain: 0.28, chords: [CH[0]] })

    // ---- beat 1: "Introducing code-motion" ----
    const hookWords = T.hook || [T.intro, T.name, T.ringOn]
    hookWords.forEach((t, i) => click(t, 0.75, (i - 1) * 0.2))
    air(0.4, 0.8, 0.75)
    bwoom(T.key[0] + 0.05, 0.65, 1.6)
    chord(T.ringOn, ['A3', 'E4'], 1.0, 0.45, true) // edge ring ignites on "motion"
    glide(1.8, 1.0, 0.85, 0, false) // camera orbits

    // ---- beat 2: "Written as code" ----
    T.written.forEach((t, i) => click(t, 0.7, (i - 1) * 0.2))
    // soft typing ticks while code types in
    for (let f = Math.ceil(T.typed[0] * 12); f / 12 < T.typed[1]; f += 2) {
      k.play('key', f / 12, { gain: 0.35, pan: 0.2, minor: true })
    }
    // live clock / timeline appears
    click(T.time, 0.7, -0.3)
    k.tone(T.time, { f: 'D4', type: 'triangle', dur: 0.4, gain: 0.08, pan: -0.3, minor: true })
    click(T.frame, 0.65, -0.3)
    click(T.sound, 0.65, 0.3)
    glide(9.2, 0.8, 0.8, 0, false)

    // ---- beat 3: "86 looks from the AI Style Atlas" ----
    T.cards.forEach((c, idx) => {
      const ta = c + T.travel - 0.05
      k.tone(ta, { f: [[0, 200 + (idx % 4) * 30], [0.12, 105]], dur: 0.15, gain: 0.09, pan: 0.2, minor: true })
      k.noise(ta, { dur: 0.05, color: 'brown', filter: 'lowpass', f: 600, gain: 0.09, pan: 0.2, minor: true })
    })
    // 86 counter ticks
    ticks((t) => Math.round(86 * eo(sm(T.cnt[0], T.cnt[1], t))), T.cnt[0] + 0.02, T.cnt[1] - 0.02, 0.065, 0.5, 0.2)
    air(T.cnt[0] + 0.1, T.cnt[1] - T.cnt[0], 0.9)
    // BIG HIT on 86:
    bwoom(T.cnt[1], 1.1, 2.0, 52)
    chord(T.cnt[1], ['D3', 'A3', 'D4', 'F#4'], 1.6, 0.85)
    k.noise(T.cnt[1], { dur: 0.8, color: 'pink', filter: 'lowpass', f: [[0, 2000], [0.8, 200]], gain: 0.14, a: 0.01, verb: 0.35 })
    click(T.looks, 0.7, -0.3)
    click(T.atlas, 0.7, -0.2)
    glide(13.6, 0.85, 0.9, 0, false) // camera swings to top view

    // ---- beat 4: Storyboard -> Code -> MP4; no video editor ----
    k.noise(T.board, { dur: 0.4, color: 'pink', filter: 'bandpass', f: [[0, 500], [0.4, 1600]], q: 0.8, gain: 0.08, a: 0.3, pan: -0.4, minor: true })
    click(T.inArrow[0], 0.7, -0.3)
    chord(T.inArrow[0], ['E4', 'G#4', 'B4'], 0.6, 0.4, true) // storyboard checkmark ✓
    // code pulse
    k.noise(T.writes, { dur: 0.35, color: 'pink', filter: 'bandpass', f: [[0, 450], [0.35, 2000]], q: 1.1, gain: 0.07, a: 0.2, minor: true })
    click(T.writes, 0.75, 0.2)
    // MP4 card out
    click(T.outArrow[0], 0.65, 0.3)
    k.noise(T.mp4, { dur: 0.45, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.45, 1800]], q: 0.9, gain: 0.09, a: 0.3, pan: 0.4, minor: true })
    click(T.mp4, 0.7, 0.4)
    // "video editor" red strike
    click(T.editor, 0.65, 0)
    k.noise(T.strike[0], { dur: 0.24, filter: 'bandpass', f: [[0, 900], [0.24, 2500]], q: 0.9, gain: 0.12, a: 0.08, pan: 0.2 })
    // low wrong strike mark
    k.tone(T.xmark, { f: 'E3', type: 'triangle', dur: 0.2, gain: 0.18, hold: 0.08, filter: 'lowpass', f2: 900, pan: 0.35 })
    k.tone(T.xmark + 0.12, { f: 'C3', type: 'triangle', dur: 0.4, gain: 0.18, hold: 0.12, filter: 'lowpass', f2: 800, pan: 0.35 })
    bwoom(T.xmark, 0.4, 0.6, 50)

    // ---- beat 5: git & PR diff ----
    chord(T.git, ['D4', 'F#4', 'A4'], 1.0, 0.75) // git ✓
    bwoom(T.git, 0.38, 0.8, 70)
    click(T.git, 0.8, 0.3)
    // PR diff panel slides in
    k.noise(T.pr, { dur: 0.4, color: 'pink', filter: 'bandpass', f: [[0, 500], [0.4, 1800]], q: 0.8, gain: 0.08, a: 0.3, pan: -0.3, minor: true })
    click(T.prLabel, 0.7, -0.2)
    // loop ring: smooth circular whoosh
    ;[[-0.6, 0], [0, 0.2], [0.6, 0.4]].forEach(([pan, dt]) =>
      k.noise(T.loop[0] + dt, { dur: 0.32, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.18, 1300], [0.32, 500]], q: 0.9, gain: 0.1, a: 0.14, pan, minor: true })
    )
    click(T.rerender, 0.7, 0.2)

    // ---- beat 6: white stage sweep, tagline, agents ----
    air(26.2, 0.3, 0.6)
    k.noise(T.sweep[0], { dur: 0.5, color: 'pink', filter: 'bandpass', f: [[0, 380], [0.25, 3000], [0.5, 900]], q: 0.8, gain: 0.24, a: 0.22, pan: -0.4, verb: 0.3 })
    k.noise(T.sweep[0] + 0.12, { dur: 0.4, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.2, 2600], [0.4, 900]], q: 0.8, gain: 0.16, a: 0.15, pan: 0.4, verb: 0.3 })
    bwoom(T.sweep[0] + 0.22, 0.52, 1.2, 60)
    // agent pills
    T.pills.forEach((t, i) => click(t, 0.7, (i - 1.5) * 0.2))
    chord(T.pills[3], ['D2', 'A2', 'D3', 'F#3', 'A3', 'E4'], 1.8, 0.9) // resolving chord
    bwoom(T.pills[3], 0.55, 1.5, 55)
    click(T.install, 0.65, 0)
  }

  window.LAUNCH_SCORE = launchScore
  if (window.VIDEOS?.launch) {
    window.VIDEOS.launch.score = launchScore
  }
})()
