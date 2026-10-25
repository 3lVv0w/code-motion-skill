// launch: "Introducing code-motion", a ~33 s keynote-style launch film in the Product Launch Reveal style
// (Futurepedia AI Style Atlas, prompts/product-launch.md). 1920x1080, drawn on the reference's 1280x720 grid.
// One glossy hero slab on a near-black stage; its inset die is a little screen that shows code, a timeline and a
// play glyph. One continuous studio camera orbits and pushes between beats; a light-sweep wipe goes to the white
// stage for the tagline. Every time below comes from the voiceover (BEATS / W), never from loose numbers.
// Stage, body, chip, words, label, callout, arrow, bez, loopRing, finish: copied from the reference and adapted only
// where the die content and the output resolution need it.
;(function () {
  const PI = Math.PI
  const sm = (a, b, x) => H.smooth(a, b, x)
  const io = (x) => H.ease.inOut(H.clamp(x))
  const eo = (x) => H.ease.out(H.clamp(x))
  const GV = ['#b69cff', '#e879f9', '#ff9a4d'] // violet -> orange
  const GT = ['#5eead4', '#38bdf8', '#6d7cff'] // teal -> blue
  const GG = ['#7cf0b8', '#2dd4bf'] // green -> teal
  const RED = '#ff453a'
  const INK = '#f5f5f7', GREY = '#a1a1a6'
  const MONO = '"IBM Plex Mono"'

  // ---------- voiceover timing (ElevenLabs takes, word starts in seconds from each line's start) ----------
  const BEATS = [
    { id: 'hook', start: 0.4, end: 2.12, text: 'Introducing code motion.' },
    { id: 'code', start: 2.9, end: 9.22, text: 'Product videos, written as code. Every frame is drawn from time, and every sound is synthesized.' },
    { id: 'styles', start: 10.0, end: 13.39, text: 'Pick any of eighty-six looks from the AI Style Atlas.' },
    { id: 'agent', start: 14.1, end: 19.81, text: 'Your coding agent storyboards it, writes it, and renders the MP4. No video editor.' },
    { id: 'git', start: 20.6, end: 26.27, text: 'It all lives in git, so you can review a video in a pull request, and render it again any time.' },
    { id: 'tag', start: 27.4, end: 31.67, text: 'Code motion. Works with Claude Code, Codex, Cursor, and more.' },
  ]
  const WORDS = {
    hook: { Introducing: 0, code: 0.71, motion: 0.99 },
    code: { written: 1.07, as: 1.41, code: 1.56, frame: 2.71, time: 3.73, sound: 4.78, synthesized: 5.25 },
    styles: { Pick: 0, 'eighty-six': 0.63, looks: 1.25, AI: 1.86, Atlas: 2.62 },
    agent: { agent: 0.67, storyboards: 1.07, writes: 2.03, renders: 2.75, MP4: 3.22, No: 4.39, video: 4.63, editor: 4.99 },
    git: { git: 0.8, review: 1.76, pull: 2.68, render: 3.91, again: 4.33, time: 4.98 },
    tag: { Code: 0, motion: 0.38, Works: 1.1, Claude: 1.6, Codex: 2.47, Cursor: 3.03, more: 3.62 },
  }
  const B = Object.fromEntries(BEATS.map((b) => [b.id, b]))
  const W = (beat, w) => B[beat].start + WORDS[beat][w]
  const DURATION = +(B.tag.end + 1.1).toFixed(2)

  // derived event times (sound reads the same table through window.LAUNCH)
  const T = {
    hook: [W('hook', 'Introducing'), W('hook', 'code'), W('hook', 'motion')],
    key: [0.9, 2.2], rim: [0.3, 1.2], ringOn: W('hook', 'motion'),
    intro: W('hook', 'Introducing'), name: W('hook', 'code'), head: [2.3, 2.85],
    written: [W('code', 'written'), W('code', 'as'), W('code', 'code')], typed: [W('code', 'written'), W('code', 'code') + 0.5],
    frame: W('code', 'frame') - 0.1, time: W('code', 'time') - 0.1, sound: W('code', 'sound') - 0.1, out2: [9.3, 9.8],
    cards: Array.from({ length: 14 }, (_, i) => B.styles.start - 0.15 + i * 0.2), travel: 1.2,
    cnt: [W('styles', 'eighty-six') - 0.2, W('styles', 'eighty-six') + 0.3], looks: W('styles', 'looks') - 0.05, atlas: W('styles', 'AI') - 0.1, out3: [13.45, 13.95],
    agent: W('agent', 'agent') - 0.1, board: W('agent', 'storyboards') - 0.1, inArrow: [W('agent', 'storyboards') + 0.35, W('agent', 'writes') - 0.05],
    writes: W('agent', 'writes') - 0.05, outArrow: [W('agent', 'renders') - 0.2, W('agent', 'renders') + 0.1], mp4: W('agent', 'renders') + 0.1,
    editor: W('agent', 'No'), strike: [W('agent', 'editor') - 0.15, W('agent', 'editor') + 0.1], xmark: W('agent', 'editor') + 0.12,
    git: W('git', 'git') - 0.1, out4: [21.9, 22.4], pr: W('git', 'review') - 0.1, prLabel: W('git', 'pull') - 0.1,
    loop: [W('git', 'render') - 0.05, W('git', 'render') + 0.7], rerender: W('git', 'again'),
    sweep: [26.45, 26.95], tagName: [W('tag', 'Code'), W('tag', 'motion')],
    pills: [W('tag', 'Claude'), W('tag', 'Codex'), W('tag', 'Cursor'), W('tag', 'more')], install: W('tag', 'more') + 0.35,
  }
  const KEYS = [
    { t: 0, cx: 640, cy: 640, s: 0.58, yaw: -0.8, pitch: 0.3 },
    { t: 2.3, cx: 640, cy: 628, s: 0.62, yaw: -0.66, pitch: 0.32 },
    { t: 3.3, cx: 860, cy: 540, s: 0.8, yaw: -0.34, pitch: 0.42 },
    { t: 9.3, cx: 870, cy: 536, s: 0.84, yaw: -0.1, pitch: 0.46 },
    { t: 10.0, cx: 900, cy: 520, s: 0.78, yaw: -0.06, pitch: 0.46 },
    { t: 13.5, cx: 905, cy: 516, s: 0.82, yaw: 0.04, pitch: 0.48 },
    { t: 14.3, cx: 640, cy: 470, s: 0.68, yaw: 0.06, pitch: 0.72 },
    { t: 21.7, cx: 650, cy: 470, s: 0.71, yaw: 0.18, pitch: 0.74 },
    { t: 22.5, cx: 900, cy: 540, s: 0.74, yaw: -0.25, pitch: 0.42 },
    { t: 26.4, cx: 910, cy: 536, s: 0.78, yaw: -0.08, pitch: 0.44 },
    { t: 27.0, cx: 640, cy: 610, s: 0.6, yaw: 0.3, pitch: 0.36 },
    { t: DURATION, cx: 640, cy: 606, s: 0.62, yaw: 0.42, pitch: 0.36 },
  ]
  const KEYS_PORTRAIT = [
    { t: 0, cx: 360, cy: 920, s: 0.65, yaw: -0.8, pitch: 0.3 },
    { t: 2.3, cx: 360, cy: 900, s: 0.7, yaw: -0.66, pitch: 0.32 },
    { t: 3.3, cx: 360, cy: 750, s: 0.76, yaw: -0.34, pitch: 0.42 },
    { t: 9.3, cx: 360, cy: 746, s: 0.78, yaw: -0.1, pitch: 0.46 },
    { t: 10.0, cx: 360, cy: 840, s: 0.7, yaw: -0.06, pitch: 0.46 },
    { t: 13.5, cx: 360, cy: 836, s: 0.72, yaw: 0.04, pitch: 0.48 },
    { t: 14.3, cx: 360, cy: 600, s: 0.58, yaw: 0.06, pitch: 0.72 },
    { t: 21.7, cx: 360, cy: 600, s: 0.6, yaw: 0.18, pitch: 0.74 },
    { t: 22.5, cx: 360, cy: 780, s: 0.68, yaw: -0.25, pitch: 0.42 },
    { t: 26.4, cx: 360, cy: 776, s: 0.7, yaw: -0.08, pitch: 0.44 },
    { t: 27.0, cx: 360, cy: 860, s: 0.58, yaw: 0.3, pitch: 0.36 },
    { t: DURATION, cx: 360, cy: 856, s: 0.6, yaw: 0.42, pitch: 0.36 },
  ]

  // ---------- geometry: the reference's rounded slab with an inset die ----------
  const HALF = 1, RAD = 0.27, THICK = 0.12, SEG = 48
  function rr(a, r, seg) {
    const pts = [], cs = [[a - r, a - r], [-(a - r), a - r], [-(a - r), -(a - r)], [a - r, -(a - r)]]
    cs.forEach(([cx, cz], k) => { for (let i = 0; i <= seg; i++) { const an = (k * PI) / 2 + (i / seg) * (PI / 2); pts.push([cx + r * Math.cos(an), cz + r * Math.sin(an), an]) } })
    return pts
  }
  const OUT = rr(HALF, RAD, SEG), DIE = rr(0.66, 0.12, 5)
  // the die's screen content: code rows (seeded tokens), a timeline, a play glyph
  const ROWS = (() => {
    const r = H.rng(2024), cols = ['140,230,255', '190,170,255', '255,170,120', '205,205,220', '205,205,220']
    return Array.from({ length: 9 }, (_, i) => {
      let x = -0.54 + r.int(0, 3) * 0.06; const toks = []
      for (let k = 0, n = r.int(2, 4); k < n && x < 0.5; k++) { const len = Math.min(r.range(0.06, 0.26), 0.54 - x); toks.push({ x0: x, x1: x + len, col: r.pick(cols) }); x += len + 0.035 }
      return { z: -0.5 + i * 0.1, toks }
    })
  })()

  function cam(c) {
    const cyw = Math.cos(c.yaw), syw = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), D = 7, F = c.s * 1900
    const P = (x, y, z) => { const X = x * cyw - z * syw, Z = x * syw + z * cyw, up = y * cp - Z * sp, dep = Z * cp + y * sp, k = F / (D - dep); return [c.cx + X * k, c.cy - up * k, dep] }
    const N = (nx, nz) => [nx * cyw - nz * syw, nx * syw + nz * cyw]
    return Object.assign({}, c, { P, N, unit: F / D })
  }
  function keyed(keys, t) {
    if (t <= keys[0].t) return Object.assign({}, keys[0])
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1]
      if (t <= b.t) { const e = io((t - a.t) / (b.t - a.t)), o = {}; for (const k in a) o[k] = H.lerp(a[k], b[k], e); return o }
    }
    return Object.assign({}, keys[keys.length - 1])
  }
  const poly = (x, pts) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath() }
  const gauss = (d, k) => Math.exp(-d * d * k)

  // ---------- stage (reference) ----------
  function stage(x, Wd, Hh, c, L, t) {
    if (L.white) {
      x.fillStyle = '#e4e4e9'; x.fillRect(0, 0, Wd, Hh)
      const g = x.createRadialGradient(c.cx, c.cy - 220, 40, c.cx, c.cy - 120, 900)
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f4f4f7'); g.addColorStop(1, '#dcdce2')
      x.fillStyle = g; x.fillRect(0, 0, Wd, Hh)
      return
    }
    x.fillStyle = '#030304'; x.fillRect(0, 0, Wd, Hh)
    const k = L.key
    let g = x.createRadialGradient(c.cx, c.cy - c.unit * 0.9, 10, c.cx, c.cy - c.unit * 0.6, 820)
    g.addColorStop(0, `rgba(44,47,60,${0.9 * k})`); g.addColorStop(0.45, `rgba(20,21,28,${0.8 * k})`); g.addColorStop(1, 'rgba(3,3,4,0)')
    x.fillStyle = g; x.fillRect(0, 0, Wd, Hh)
    x.save(); x.translate(c.cx, c.cy); x.scale(1, 0.24)
    g = x.createRadialGradient(0, 0, 0, 0, 0, c.unit * 2.6)
    g.addColorStop(0, `rgba(70,74,92,${0.42 * k})`); g.addColorStop(1, 'rgba(70,74,92,0)')
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, c.unit * 2.6, 0, 7); x.fill(); x.restore()
    const r = H.rng(404)
    for (let i = 0; i < 6; i++) {
      const bx = r() * Wd + Math.sin(t * 0.2 + i) * 14 - (c.cx - 640) * 0.15, by = r.range(0.05, 0.5) * Hh, rad = r.range(40, 110), hue = r.pick(['120,110,255', '255,140,90', '90,200,255'])
      const a = r.range(0.025, 0.05) * k
      g = x.createRadialGradient(bx, by, 0, bx, by, rad)
      g.addColorStop(0, `rgba(${hue},${a})`); g.addColorStop(0.6, `rgba(${hue},${a * 0.6})`); g.addColorStop(1, `rgba(${hue},0)`)
      x.fillStyle = g; x.beginPath(); x.arc(bx, by, rad, 0, 7); x.fill()
    }
  }

  // ---------- the die as a screen: code rows, timeline, play glyph (replaces the reference's network) ----------
  function dieScreen(x, P, yT, L, sc) {
    const seg = (x0, z0, x1, z1) => { const a = P(x0, yT, z0), b = P(x1, yT, z1); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]) }
    x.lineCap = 'round'
    const dimCode = 1 - 0.7 * L.playIcon
    const fp = L.fwd >= 0 ? L.fwd * (ROWS.length + 3) - 1.5 : -99
    ROWS.forEach((row, i) => {
      const f = H.clamp(L.code * ROWS.length - i)
      if (f <= 0) return
      const glow = gauss(fp - i, 0.9)
      const xEnd = row.toks[0].x0 + (row.toks[row.toks.length - 1].x1 - row.toks[0].x0) * f
      for (const tk of row.toks) {
        if (tk.x0 >= xEnd) break
        const x1 = Math.min(tk.x1, xEnd)
        x.strokeStyle = `rgba(${glow > 0.15 ? '170,235,255' : tk.col},${Math.min(1, (0.55 + 0.45 * glow) * dimCode * L.codeA)})`
        x.lineWidth = (3.6 + 1.6 * glow) * sc
        x.beginPath(); seg(tk.x0, row.z, x1, row.z); x.stroke()
      }
      // the typing caret at the end of the row being written
      if (f < 1) { const p = P(xEnd + 0.03, yT, row.z); x.fillStyle = `rgba(255,255,255,${0.9 * L.codeA})`; x.fillRect(p[0] - 1.2 * sc, p[1] - 6 * sc, 2.4 * sc, 12 * sc) }
    })
    // timeline with frame ticks and a playhead
    if (L.tl > 0.01) {
      const z = 0.47, xa = -0.54, xb = 0.54, xp = xa + (xb - xa) * L.play
      x.strokeStyle = `rgba(255,255,255,${0.28 * L.tl})`; x.lineWidth = 2 * sc; x.beginPath(); seg(xa, z, xb, z); x.stroke()
      x.lineWidth = 1 * sc; x.beginPath(); for (let q = xa; q <= xb + 1e-6; q += 0.054) seg(q, z - 0.018, q, z + 0.018); x.stroke()
      const A = P(xa, yT, z), Bp = P(xp, yT, z), g = x.createLinearGradient(A[0], A[1], Bp[0] + 1, Bp[1])
      GV.forEach((s, i) => g.addColorStop(i / (GV.length - 1), s))
      x.strokeStyle = g; x.globalAlpha = L.tl; x.lineWidth = 3 * sc; x.beginPath(); x.moveTo(A[0], A[1]); x.lineTo(Bp[0], Bp[1]); x.stroke(); x.globalAlpha = 1
      const gg = x.createRadialGradient(Bp[0], Bp[1], 0, Bp[0], Bp[1], 12 * sc); gg.addColorStop(0, `rgba(255,255,255,${L.tl})`); gg.addColorStop(0.35, `rgba(255,170,110,${0.8 * L.tl})`); gg.addColorStop(1, 'rgba(255,150,80,0)')
      x.fillStyle = gg; x.beginPath(); x.arc(Bp[0], Bp[1], 12 * sc, 0, 7); x.fill()
    }
    // play glyph: the rendered video
    if (L.playIcon > 0.01) {
      const tri = [[-0.13, -0.22], [0.19, -0.05], [-0.13, 0.12]].map(([a, b]) => P(a, yT, b))
      const g = x.createLinearGradient(tri[0][0], tri[0][1], tri[1][0], tri[1][1]); GV.forEach((s, i) => g.addColorStop(i / (GV.length - 1), s))
      x.save(); x.globalAlpha = L.playIcon; x.shadowColor = 'rgba(220,120,255,0.8)'; x.shadowBlur = 22 * sc; x.fillStyle = g
      x.lineJoin = 'round'; x.lineWidth = 6 * sc; x.strokeStyle = g; poly(x, tri); x.fill(); x.stroke(); x.restore()
    }
    // a card's colours wash through the die as it is absorbed
    if (L.tint && L.tint[3] > 0.01) { x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = `rgba(${L.tint[0]},${L.tint[1]},${L.tint[2]},${0.32 * L.tint[3]})`; poly(x, DIE.map((p) => P(p[0], yT, p[1]))); x.fill(); x.restore() }
  }

  // ---------- the hero object (reference body(), die content swapped) ----------
  function body(x, c, L, mirror) {
    const hv = L.hover, yT = hv + THICK / 2, yB = hv - THICK / 2, sc = c.unit / 271
    const P = mirror ? (a, y, b) => c.P(a, -y, b) : c.P
    const n = OUT.length, top = OUT.map((p) => P(p[0], yT, p[1])), bot = OUT.map((p) => P(p[0], yB, p[1]))
    const white = L.white ? 1 : 0
    const segs = []
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a1 = OUT[i][2], a2 = OUT[j][2]
      let nx = Math.cos(a1) + Math.cos(a2), nz = Math.sin(a1) + Math.sin(a2); const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl
      const [NX, NZ] = c.N(nx, nz)
      segs.push({ i, j, NX, NZ })
      if (NZ < -0.03) continue
      const lam = Math.max(0, NX * -0.6 + NZ * 0.8), sd = Math.max(0, NX * -0.25 + NZ * 0.97), spec = Math.pow(sd, 18), sheen = Math.pow(sd, 4)
      const rim = Math.pow(Math.max(0, NX), 3)
      let v = 14 + lam * 62 * L.key + Math.min(1, spec * 0.85 + sheen * 0.3) * 140 * L.key + rim * 120 * L.rim + white * 40
      if (mirror) v *= 0.9
      const cc = (m) => `rgb(${Math.min(255, v * 0.96 * m) | 0},${Math.min(255, v * 0.98 * m) | 0},${Math.min(255, (v * 1.05 + 3) * m) | 0})`
      const m = Math.max(1, Math.ceil(Math.hypot(top[j][0] - top[i][0], top[j][1] - top[i][1]) / 40))
      const lp = (A, Bq, f) => [A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f]
      for (let q = 0; q < m; q++) {
        const t0 = lp(top[i], top[j], q / m), t1 = lp(top[i], top[j], (q + 1) / m), b0 = lp(bot[i], bot[j], q / m), b1 = lp(bot[i], bot[j], (q + 1) / m)
        let ex = t1[0] - t0[0], ey = t1[1] - t0[1]; const el = Math.hypot(ex, ey) || 1; ex /= el; ey /= el
        const tm = [(t0[0] + t1[0]) / 2, (t0[1] + t1[1]) / 2], bm = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2]
        let gx = -ey, gy = ex, hh = (bm[0] - tm[0]) * gx + (bm[1] - tm[1]) * gy
        if (Math.abs(hh) < 0.5) { gx = bm[0] - tm[0]; gy = bm[1] - tm[1]; hh = 1 }
        const sg = x.createLinearGradient(tm[0], tm[1], tm[0] + gx * hh, tm[1] + gy * hh)
        if (mirror) { sg.addColorStop(0, cc(0.5)); sg.addColorStop(0.45, cc(1)); sg.addColorStop(1, cc(1.2)) }
        else { sg.addColorStop(0, cc(1.32)); sg.addColorStop(0.3, cc(1.05)); sg.addColorStop(0.52, cc(0.62)); sg.addColorStop(0.74, cc(0.82)); sg.addColorStop(1, cc(0.42)) }
        x.fillStyle = sg; x.strokeStyle = sg; x.lineWidth = 0.9
        poly(x, [t1, t0, b0, b1]); x.fill(); x.stroke()
      }
    }
    x.lineWidth = 1.2 * sc; x.strokeStyle = 'rgba(0,0,0,0.6)'
    for (const s of segs) if (s.NZ > 0) { x.beginPath(); x.moveTo(bot[s.i][0], bot[s.i][1]); x.lineTo(bot[s.j][0], bot[s.j][1]); x.stroke() }
    if (mirror) { x.fillStyle = '#060608'; poly(x, bot); x.fill(); return }

    let minY = 1e9, maxY = -1e9; top.forEach((p) => { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]) })
    poly(x, top)
    let g = x.createLinearGradient(0, minY, 0, maxY)
    g.addColorStop(0, white ? '#2a2c33' : '#1d2028'); g.addColorStop(1, '#08090c')
    x.fillStyle = g; x.fill()
    x.save(); poly(x, top); x.clip()
    g = x.createLinearGradient(0, minY, 0, maxY)
    g.addColorStop(0, `rgba(255,255,255,${0.16 * L.key})`); g.addColorStop(0.35, `rgba(255,255,255,${0.035 * L.key})`); g.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = g; x.fillRect(0, minY, 1280, maxY - minY)
    { const A = P(-1.1, yT, 0.6), Bq = P(0.6, yT, -1.1); const sg = x.createLinearGradient(A[0], A[1], Bq[0], Bq[1])
      sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.3, 'rgba(255,255,255,0)'); sg.addColorStop(0.46, `rgba(255,255,255,${0.11 * L.key})`); sg.addColorStop(0.5, `rgba(255,255,255,${0.05 * L.key})`); sg.addColorStop(0.66, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,255,255,0)')
      x.fillStyle = sg; x.fillRect(0, minY, 1280, maxY - minY) }
    const die = DIE.map((p) => P(p[0], yT, p[1]))
    poly(x, die); x.fillStyle = 'rgba(4,5,8,0.92)'; x.fill()
    x.lineWidth = 0.6; x.strokeStyle = `rgba(150,160,200,${0.06 + 0.05 * L.act})`; x.beginPath()
    for (let q = -0.56; q <= 0.57; q += 0.08) { let a = P(q, yT, -0.6), b = P(q, yT, 0.6); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); a = P(-0.6, yT, q); b = P(0.6, yT, q); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]) }
    x.stroke()
    dieScreen(x, P, yT, L, sc)
    if (L.spec > -0.3 && L.spec < 1.3) {
      const A = P(-1.1, yT, 1.1), Bq = P(1.1, yT, -1.1), u = L.spec
      g = x.createLinearGradient(A[0], A[1], Bq[0], Bq[1])
      const st = (o, a) => { const q = u + o; if (q > 0 && q < 1) g.addColorStop(q, `rgba(255,255,255,${a})`) }
      g.addColorStop(0, 'rgba(255,255,255,0)'); st(-0.16, 0); st(-0.05, 0.08); st(0, 0.42 * L.key); st(0.02, 0.18); st(0.1, 0); g.addColorStop(1, 'rgba(255,255,255,0)')
      x.fillStyle = g; x.fillRect(0, 0, 1280, 720)
    }
    x.restore()
    if (L.ring > 0.01) {
      const ctr = P(0, yT, 0)
      x.save()
      const cg = x.createConicGradient(L.ringRot || 0, ctr[0], ctr[1])
      ;['#b69cff', '#e879f9', '#ff9a4d', '#5eead4', '#6d7cff', '#b69cff'].forEach((s, i, arr) => cg.addColorStop(i / (arr.length - 1), s))
      x.strokeStyle = cg; x.globalAlpha = Math.min(1, L.ring); x.lineWidth = 2.2 * sc
      x.shadowColor = 'rgba(200,130,255,0.9)'; x.shadowBlur = 16 * sc * Math.min(1.6, L.ring)
      poly(x, die); x.stroke()
      x.shadowBlur = 0; x.lineWidth = 0.8 * sc; x.strokeStyle = `rgba(255,255,255,${0.5 * Math.min(1, L.ring)})`; poly(x, die); x.stroke()
      x.restore()
    }
    x.lineWidth = 1.5 * sc
    for (const s of segs) {
      const back = Math.max(0, -s.NZ), front = Math.max(0, s.NX * -0.6 + s.NZ * 0.8)
      const a = Math.min(1, Math.pow(back, 1.2) * 0.95 * L.rim + front * 0.45 * L.key + 0.06)
      x.strokeStyle = `rgba(235,238,255,${a})`
      x.beginPath(); x.moveTo(top[s.i][0], top[s.i][1]); x.lineTo(top[s.j][0], top[s.j][1]); x.stroke()
    }
  }
  // offscreen layers at full output resolution, drawn on the 1280x720 or 720x1280 grid through SCALE
  let SCALE = 1, RL = null, GL = null, BASE_W = 1280, BASE_H = 720
  const fullLayer = (L0) => {
    const w = Math.round(BASE_W * SCALE), h = Math.round(BASE_H * SCALE)
    if (!L0 || L0.width !== w || L0.height !== h) L0 = H.layer(w, h)
    const r = L0.getContext('2d')
    r.setTransform(1, 0, 0, 1, 0, 0)
    r.globalCompositeOperation = 'source-over'
    r.clearRect(0, 0, w, h)
    r.setTransform(SCALE, 0, 0, SCALE, 0, 0)
    return L0
  }
  function chip(x, c, L) {
    const u = c.unit, white = !!L.white
    x.save(); x.translate(c.cx, c.cy); x.scale(1, Math.max(0.18, Math.sin(c.pitch) * 0.8))
    let g = x.createRadialGradient(0, 0, 0, 0, 0, u * 1.45)
    g.addColorStop(0, `rgba(0,0,0,${white ? 0.32 : 0.75})`); g.addColorStop(0.6, `rgba(0,0,0,${white ? 0.1 : 0.3})`); g.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, u * 1.45, 0, 7); x.fill()
    if (L.ring > 0.01 && !white) {
      g = x.createRadialGradient(0, 0, 0, 0, 0, u * 1.9)
      g.addColorStop(0, `rgba(170,110,255,${0.16 * Math.min(1.5, L.ring)})`); g.addColorStop(0.5, `rgba(255,130,90,${0.05 * Math.min(1.5, L.ring)})`); g.addColorStop(1, 'rgba(0,0,0,0)')
      x.globalCompositeOperation = 'lighter'; x.fillStyle = g; x.beginPath(); x.arc(0, 0, u * 1.9, 0, 7); x.fill()
    }
    x.restore()
    RL = fullLayer(RL)
    const r = RL.getContext('2d')
    body(r, c, L, true)
    r.globalCompositeOperation = 'destination-in'
    g = r.createLinearGradient(0, c.cy, 0, c.cy + u * 0.75)
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    r.fillStyle = g; r.fillRect(0, 0, BASE_W, BASE_H)
    x.save(); x.globalAlpha = white ? 0.22 : 0.45 * Math.max(0.2, L.key); x.drawImage(RL, 0, 0, BASE_W, BASE_H); x.restore()
    body(x, c, L, false)
  }

  // ---------- type (reference) ----------
  function setF(x, w, px, fam) { x.font = `${w} ${px}px ${fam || '"Inter"'}`; try { x.letterSpacing = (px >= 40 && !fam ? -Math.round(px * 0.035) : 0) + 'px' } catch (e) {} }
  function grad(x, x0, x1, stops) { const g = x.createLinearGradient(x0, 0, x1, 0); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g }
  function wordsW(x, list, w, px) { setF(x, w, px); const sp = x.measureText(' ').width + px * 0.08; let tot = 0; list.forEach((it, i) => { it._w = x.measureText(it.s).width; tot += it._w + (i ? sp : 0) }); return { tot, sp } }
  function words(x, list, X, Y, w, px, t, o) {
    o = o || {}
    x.save()
    const { tot, sp } = wordsW(x, list, w, px)
    let cx = o.align === 'center' ? X - tot / 2 : o.align === 'right' ? X - tot : X
    const x0 = cx
    for (const it of list) {
      const e = eo((t - it.t) / (o.dur || 0.6))
      if (e > 0.001) {
        x.globalAlpha = e * (o.alpha == null ? 1 : o.alpha)
        const b = (1 - e) * (o.blur == null ? 10 : o.blur) * SCALE
        x.filter = b > 0.3 ? `blur(${b.toFixed(1)}px)` : 'none'
        x.fillStyle = it.fill === 'grad' ? grad(x, o.gx0 == null ? x0 : o.gx0, o.gx1 == null ? x0 + tot : o.gx1, o.stops || GV) : it.fill || o.fill || INK
        x.textAlign = 'left'; x.textBaseline = 'alphabetic'
        x.fillText(it.s, cx, Y + (1 - e) * px * 0.28)
      }
      cx += it._w + sp
    }
    x.restore()
    return { x0, tot }
  }
  function label(x, s, X, Y, w, px, fill, align, a, fam) {
    x.save(); setF(x, w, px, fam); x.globalAlpha = a == null ? 1 : a; x.fillStyle = fill; x.textAlign = align || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); x.restore()
  }
  function callout(x, pts, p, lab, sub, side, o) {
    o = o || {}
    if (p <= 0) return
    const ink = o.ink || '255,255,255'
    x.save()
    const [A] = pts, e = eo(p / 0.35)
    x.fillStyle = `rgba(${ink},${0.95 * e})`; x.beginPath(); x.arc(A[0], A[1], 3.6, 0, 7); x.fill()
    x.strokeStyle = `rgba(${ink},${0.35 * e})`; x.lineWidth = 1; x.beginPath(); x.arc(A[0], A[1], 5 + 6 * e, 0, 7); x.stroke()
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    let rem = len * io(sm(0.1, 0.75, p))
    x.strokeStyle = `rgba(${ink},0.7)`; x.lineWidth = 1; x.beginPath(); x.moveTo(A[0], A[1])
    for (let i = 1; i < pts.length && rem > 0; i++) {
      const a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(1, rem / d)
      x.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); rem -= d
    }
    x.stroke()
    const la = sm(0.6, 1, p), E = pts[pts.length - 1], dx = (1 - la) * 10 * (side === 'r' ? 1 : -1)
    if (la > 0) {
      const tx = side === 'r' ? E[0] + 14 + dx : E[0] - 14 + dx, al = side === 'r' ? 'left' : 'right'
      label(x, lab, tx, E[1] + 10, 600, o.px || 32, o.labFill || `rgb(${ink})`, al, la)
      if (sub) label(x, sub, tx, E[1] + 10 + (o.px || 32) * 1.05, 400, o.subPx || 28, o.subFill || GREY, al, la, o.subFam)
    }
    x.restore()
  }
  function arrow(x, pts, p, stroke, lw, head) {
    if (p <= 0) return
    const n = Math.max(2, Math.round(pts.length * H.clamp(p)))
    x.save(); x.strokeStyle = stroke; x.lineWidth = lw || 1.2; x.lineCap = 'round'; x.beginPath()
    for (let i = 0; i < n; i++) (i ? x.lineTo : x.moveTo).call(x, pts[i][0], pts[i][1])
    x.stroke()
    if (head !== false && n >= 2) {
      const a = pts[n - 2], b = pts[n - 1], an = Math.atan2(b[1] - a[1], b[0] - a[0]), hl = 10
      x.beginPath(); x.moveTo(b[0] - hl * Math.cos(an - 0.45), b[1] - hl * Math.sin(an - 0.45)); x.lineTo(b[0], b[1]); x.lineTo(b[0] - hl * Math.cos(an + 0.45), b[1] - hl * Math.sin(an + 0.45)); x.stroke()
    }
    x.restore()
  }
  const bez = (p0, p1, p2, p3, n) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]] })
  const bezAt = (P0, P1, P2, P3, v) => { const w = 1 - v; return [w * w * w * P0[0] + 3 * w * w * v * P1[0] + 3 * w * v * v * P2[0] + v * v * v * P3[0], w * w * w * P0[1] + 3 * w * w * v * P1[1] + 3 * w * v * v * P2[1] + v * v * v * P3[1]] }

  // ---------- style cards: one per Atlas look, painted thumbnails (cached, pre-blurred for depth of field) ----------
  const STYLES = [
    ['Blueprint', [22, 58, 112]], ['Manga', [235, 235, 235]], ['Watercolor', [240, 160, 150]], ['Film Noir', [60, 60, 66]],
    ['Whiteboard', [245, 245, 248]], ['Halftone', [250, 205, 40]], ['Deep Sea', [10, 90, 120]], ['Papercraft', [230, 150, 90]],
    ['Puppet', [255, 150, 60]], ['Flat Vector', [90, 70, 200]], ['Isometric', [170, 200, 255]], ['Manuscript', [200, 160, 80]],
    ['Tech Glow', [40, 200, 255]], ['Manim', [30, 30, 36]],
  ]
  const CARD = {}, CW = 170, CH = 204, CS = 2, CP = 40
  function paint(x, name) {
    const r = H.rng(name), w = CW, h = 140
    const fill = (c) => { x.fillStyle = c; x.fillRect(0, 0, w, h) }
    if (name === 'Blueprint') { fill('#163a70'); x.strokeStyle = 'rgba(220,235,255,0.25)'; x.lineWidth = 1; for (let q = 0; q < w; q += 14) { x.beginPath(); x.moveTo(q, 0); x.lineTo(q, h); x.moveTo(0, q); x.lineTo(w, q); x.stroke() } x.strokeStyle = '#eef4ff'; x.lineWidth = 2; x.beginPath(); x.arc(85, 72, 36, 0, 7); x.moveTo(30, 72); x.lineTo(140, 72); x.moveTo(85, 20); x.lineTo(85, 124); x.stroke() }
    else if (name === 'Manga') { fill('#f4f1ea'); x.fillStyle = '#111'; for (let yy = 0; yy < h; yy += 7) for (let xx = 0; xx < w; xx += 7) { const rr0 = 3.2 * (yy / h); x.beginPath(); x.arc(xx, yy, rr0, 0, 7); x.fill() } x.strokeStyle = '#111'; x.lineWidth = 1.5; for (let i = 0; i < 18; i++) { const a = r() * 7; x.beginPath(); x.moveTo(85 + Math.cos(a) * 30, 60 + Math.sin(a) * 30); x.lineTo(85 + Math.cos(a) * 120, 60 + Math.sin(a) * 120); x.stroke() } }
    else if (name === 'Watercolor') { fill('#f6efe2'); [[60, 60, 46, '232,120,110'], [110, 80, 42, '110,160,220'], [80, 100, 36, '240,190,90']].forEach(([a, b, rad, c]) => { const g = x.createRadialGradient(a, b, 4, a, b, rad); g.addColorStop(0, `rgba(${c},0.55)`); g.addColorStop(0.8, `rgba(${c},0.35)`); g.addColorStop(1, `rgba(${c},0)`); x.fillStyle = g; x.beginPath(); x.arc(a, b, rad, 0, 7); x.fill() }) }
    else if (name === 'Film Noir') { fill('#141416'); x.fillStyle = 'rgba(235,235,235,0.85)'; for (let i = 0; i < 6; i++) { x.save(); x.translate(20 + i * 26, 0); x.transform(1, 0, 0.5, 1, 0, 0); x.fillRect(0, 0, 12, h); x.restore() } x.fillStyle = '#000'; x.beginPath(); x.ellipse(85, 120, 26, 40, 0, PI, 0); x.fill(); x.beginPath(); x.arc(85, 66, 16, 0, 7); x.fill() }
    else if (name === 'Whiteboard') { fill('#fbfbfd'); x.strokeStyle = '#2253c9'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(26, 96); x.quadraticCurveTo(70, 30, 100, 80); x.quadraticCurveTo(120, 110, 146, 46); x.stroke(); x.strokeStyle = '#e04a3a'; x.beginPath(); x.arc(120, 100, 14, 0, 7); x.stroke() }
    else if (name === 'Halftone') { fill('#ffd21f'); x.fillStyle = '#e8322b'; for (let yy = 0; yy < h; yy += 9) for (let xx = (yy / 9) % 2 ? 4.5 : 0; xx < w; xx += 9) { x.beginPath(); x.arc(xx, yy, 2.8, 0, 7); x.fill() } x.strokeStyle = '#111'; x.lineWidth = 5; x.beginPath(); x.arc(85, 70, 34, 0, 7); x.stroke() }
    else if (name === 'Deep Sea') { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#04304a'); g.addColorStop(1, '#010a14'); x.fillStyle = g; x.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { const a = r() * w, b = r() * h, rad = 2 + r() * 5, gg = x.createRadialGradient(a, b, 0, a, b, rad * 3); gg.addColorStop(0, 'rgba(120,255,230,0.9)'); gg.addColorStop(1, 'rgba(120,255,230,0)'); x.fillStyle = gg; x.beginPath(); x.arc(a, b, rad * 3, 0, 7); x.fill() } }
    else if (name === 'Papercraft') { fill('#f3d9b8'); [['#e58a4e', 30], ['#d4683a', 56], ['#9a4a2a', 84]].forEach(([c, y0]) => { x.fillStyle = c; x.beginPath(); x.moveTo(0, h); x.lineTo(0, y0 + 20); x.lineTo(60, y0); x.lineTo(110, y0 + 24); x.lineTo(w, y0 + 6); x.lineTo(w, h); x.fill() }) }
    else if (name === 'Puppet') { const g = x.createRadialGradient(85, 70, 10, 85, 70, 110); g.addColorStop(0, '#ffd27a'); g.addColorStop(1, '#e0601e'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = '#111'; x.beginPath(); x.ellipse(85, 92, 30, 18, 0, 0, 7); x.arc(115, 70, 12, 0, 7); x.fill(); x.fillRect(60, 104, 4, 36); x.fillRect(104, 104, 4, 36) }
    else if (name === 'Flat Vector') { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1b1a4a'); g.addColorStop(1, '#5a3ec8'); x.fillStyle = g; x.fillRect(0, 0, w, h); const g2 = x.createLinearGradient(60, 40, 110, 100); g2.addColorStop(0, '#ffb86b'); g2.addColorStop(1, '#ff5f8f'); x.fillStyle = g2; x.beginPath(); x.arc(85, 70, 28, 0, 7); x.fill(); x.strokeStyle = '#ffd6a0'; x.lineWidth = 3; x.beginPath(); x.ellipse(85, 70, 50, 12, -0.3, 0, 7); x.stroke() }
    else if (name === 'Isometric') { fill('#e9f0ff'); const cube = (cx, cy, s, a, b, c) => { x.fillStyle = a; x.beginPath(); x.moveTo(cx, cy - s); x.lineTo(cx + s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx - s, cy - s / 2); x.fill(); x.fillStyle = b; x.beginPath(); x.moveTo(cx - s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx, cy + s); x.lineTo(cx - s, cy + s / 2); x.fill(); x.fillStyle = c; x.beginPath(); x.moveTo(cx + s, cy - s / 2); x.lineTo(cx, cy); x.lineTo(cx, cy + s); x.lineTo(cx + s, cy + s / 2); x.fill() }; cube(70, 70, 30, '#c9d8ff', '#9bb4f5', '#7d95e0'); cube(118, 92, 22, '#ffd9e6', '#f5a9c4', '#e08aab') }
    else if (name === 'Manuscript') { fill('#efe0bd'); x.strokeStyle = '#b8862b'; x.lineWidth = 4; x.strokeRect(14, 14, w - 28, h - 28); x.fillStyle = '#8a1c1c'; x.font = '700 64px Georgia, serif'; x.fillText('A', 30, 96); x.fillStyle = 'rgba(60,40,20,0.6)'; for (let i = 0; i < 6; i++) x.fillRect(80, 36 + i * 14, 60 - (i % 2) * 14, 4) }
    else if (name === 'Tech Glow') { fill('#05070d'); x.strokeStyle = '#38bdf8'; x.shadowColor = '#38bdf8'; x.shadowBlur = 10; x.lineWidth = 2; x.beginPath(); x.moveTo(10, 100); x.lineTo(60, 100); x.lineTo(80, 50); x.lineTo(110, 50); x.lineTo(160, 40); x.stroke(); x.shadowBlur = 0 }
    else { fill('#1c1c22'); x.strokeStyle = '#58c4dd'; x.lineWidth = 2.5; x.beginPath(); for (let q = 0; q <= w; q += 2) { const yy = 70 - Math.sin(q / 18) * 30; q ? x.lineTo(q, yy) : x.moveTo(q, yy) } x.stroke(); x.strokeStyle = 'rgba(255,255,255,0.4)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, 70); x.lineTo(w, 70); x.stroke() }
  }
  function cardSprite(i, blur) {
    const key = i + '|' + blur
    if (CARD[key]) return CARD[key]
    const c = H.layer(CW * CS + CP * 2, CH * CS + CP * 2), x = c.getContext('2d')
    if (blur) { const b = cardSprite(i, 0); x.filter = `blur(${blur * CS}px)`; x.drawImage(b, 0, 0); return (CARD[key] = c) }
    const [name] = STYLES[i]
    x.translate(CP, CP); x.scale(CS, CS)
    x.beginPath(); x.roundRect(0, 0, CW, CH, 20); x.save(); x.clip()
    x.fillStyle = '#121318'; x.fillRect(0, 0, CW, CH)
    x.save(); paint(x, name); x.restore()
    x.fillStyle = '#f5f5f7'; x.font = '600 26px "Inter"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(name, CW / 2, 172)
    const g = x.createLinearGradient(0, 0, CW, CH * 0.7); g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, CW, CH)
    x.restore()
    x.strokeStyle = 'rgba(255,255,255,0.45)'; x.lineWidth = 1; x.beginPath(); x.roundRect(0.5, 0.5, CW - 1, CH - 1, 20); x.stroke()
    return (CARD[key] = c)
  }
  function drawCard(x, i, cx, cy, s, blur, rot, a) {
    const lv = [0, 2, 5, 9]; let bi = 0; for (let k = 0; k < lv.length; k++) if (Math.abs(lv[k] - blur) < Math.abs(lv[bi] - blur)) bi = k
    const sp = cardSprite(i, lv[bi])
    x.save(); x.globalAlpha = a; x.translate(cx, cy); x.rotate(rot || 0); x.scale(s / CS, s / CS)
    x.drawImage(sp, -sp.width / 2, -sp.height / 2); x.restore()
  }
  // glossy panel used for the storyboard, the MP4 and the pull request
  function panel(x, cx, cy, w, h, a, fn) {
    if (a <= 0.001) return
    x.save(); x.globalAlpha *= a; x.translate(cx - w / 2, cy - h / 2); try { x.letterSpacing = '0px' } catch (e) {}
    x.shadowColor = 'rgba(0,0,0,0.6)'; x.shadowBlur = 30; x.fillStyle = '#121318'; x.beginPath(); x.roundRect(0, 0, w, h, 18); x.fill(); x.shadowBlur = 0
    x.save(); x.beginPath(); x.roundRect(0, 0, w, h, 18); x.clip()
    const bg = x.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1b1c24'); bg.addColorStop(1, '#0b0b10'); x.fillStyle = bg; x.fillRect(0, 0, w, h)
    fn(x, w, h)
    const g = x.createLinearGradient(0, 0, w, h * 0.8); g.addColorStop(0, 'rgba(255,255,255,0.16)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h)
    x.restore()
    x.strokeStyle = 'rgba(255,255,255,0.4)'; x.lineWidth = 1; x.beginPath(); x.roundRect(0.5, 0.5, w - 1, h - 1, 18); x.stroke()
    x.restore()
  }
  const check = (x, mx, my, rad, a, fill) => {
    x.save(); x.globalAlpha *= a; x.fillStyle = fill || '#2fd6a0'; x.beginPath(); x.arc(mx, my, rad, 0, 7); x.fill()
    x.strokeStyle = '#04120c'; x.lineWidth = rad * 0.16; x.lineCap = 'round'; x.lineJoin = 'round'
    x.beginPath(); x.moveTo(mx - rad * 0.42, my + rad * 0.04); x.lineTo(mx - rad * 0.12, my + rad * 0.35); x.lineTo(mx + rad * 0.46, my - rad * 0.3); x.stroke(); x.restore()
  }

  // ---------- finishing (reference) ----------
  let GR = null
  function finish(x, Wd, Hh, t, white) {
    if (!GR) { GR = H.layer(256, 256); const g = GR.getContext('2d'), img = g.createImageData(256, 256), r = H.rng(77); for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255 } g.putImageData(img, 0, 0) }
    if (!white) H.vignette(x, Wd, Hh, 0.55)
    const r = H.rng(900 + Math.floor(t * 24))
    x.save(); x.globalAlpha = white ? 0.04 : 0.06; x.globalCompositeOperation = 'soft-light'
    x.translate(-r() * 256, -r() * 256); x.fillStyle = x.createPattern(GR, 'repeat'); x.fillRect(0, 0, Wd + 256, Hh + 256); x.restore()
  }
  function ringGlow(base, t, pulses) { let v = base; for (const p of pulses) if (t > p) v += 0.9 * Math.exp(-(t - p) * 5); return v }
  function loopRing(x, c, L, p, a, front) {
    const N = 90, R = 1.42, y = L.hover, a0 = 1.6, cd = c.P(0, L.hover, 0)[2]
    const pts = []; for (let i = 0; i <= N * p; i++) { const an = a0 + (i / N) * PI * 2; pts.push(c.P(R * Math.cos(an), y, R * Math.sin(an))) }
    if (pts.length < 2) return
    x.save(); x.globalAlpha *= a; x.lineCap = 'round'; x.lineWidth = 2
    const g = grad(x, c.cx - c.unit * 1.8, c.cx + c.unit * 1.8, GV); x.strokeStyle = g; x.shadowColor = 'rgba(220,120,255,0.6)'; x.shadowBlur = 10
    for (let i = 1; i < pts.length; i++) { if ((pts[i][2] > cd) !== front) continue; x.beginPath(); x.moveTo(pts[i - 1][0], pts[i - 1][1]); x.lineTo(pts[i][0], pts[i][1]); x.stroke() }
    const hp = pts[pts.length - 1]
    if ((hp[2] > cd) === front) { const b = pts[pts.length - 2], an = Math.atan2(hp[1] - b[1], hp[0] - b[0]); x.fillStyle = '#ffd0f0'; x.beginPath(); x.moveTo(hp[0] + 12 * Math.cos(an), hp[1] + 12 * Math.sin(an)); x.lineTo(hp[0] + 9 * Math.cos(an + 2.3), hp[1] + 9 * Math.sin(an + 2.3)); x.lineTo(hp[0] + 9 * Math.cos(an - 2.3), hp[1] + 9 * Math.sin(an - 2.3)); x.fill() }
    x.restore()
  }

  // ---------- lighting over time ----------
  const arrive = (i) => T.cards[i] + T.travel - 0.05
  function lighting(t) {
    const pulses = T.cards.map((_, i) => arrive(i)).concat([T.ringOn, T.cnt[1], T.writes, T.mp4, T.git, T.loop[1], T.sweep[1], T.tagName[1]])
    let fwd = -1
    if (t > T.writes && t < T.writes + 0.7) fwd = (t - T.writes) / 0.6
    else if (t > T.cards[0] + T.travel && t < arrive(T.cards.length - 1) + 0.3) fwd = ((t - T.cards[0] - T.travel) % 0.6) / 0.5
    if (fwd > 1.1) fwd = -1
    // the most recent card's colour washing through the die
    let tint = null
    for (let i = 0; i < T.cards.length; i++) { const d = t - arrive(i); if (d > 0 && d < 0.6) tint = [...STYLES[i][1], Math.exp(-d * 6)] }
    const play = t < 6.2 ? 0 : ((t - 6.2) * 0.14) % 1
    return {
      key: sm(T.key[0], T.key[1], t), rim: sm(T.rim[0], T.rim[1], t),
      ring: t < T.ringOn ? 0 : ringGlow(sm(T.ringOn, T.ringOn + 0.5, t) * 0.85, t, pulses),
      spec: t < 9 ? H.map(t, 1.7, 3.6, -0.25, 1.25) : t < 20 ? H.map(t, T.cnt[1] - 0.1, T.cnt[1] + 0.8, -0.25, 1.25) : H.map(t, 27.2, 28.6, -0.25, 1.25),
      code: Math.max(0.12 * sm(1.0, 2.0, t), sm(T.typed[0], T.typed[1], t)), codeA: 1,
      tl: sm(T.time - 0.3, T.time + 0.2, t), play,
      playIcon: Math.max(sm(T.mp4, T.mp4 + 0.4, t) * (1 - sm(21.6, 22.3, t)), sm(T.sweep[0], T.sweep[1], t)),
      fwd, tint, act: sm(1.9, 2.8, t), hover: 0.36 + 0.015 * Math.sin(t * 1.2), ringRot: t * 0.3,
    }
  }

  // ================= DARK STAGE =================
  function darkScene(x, Wd, Hh, t, c, L) {
    stage(x, Wd, Hh, c, L, t)
    const yT = L.hover + THICK / 2, top = c.P(0, yT, 0)
    const ringP = sm(T.loop[0], T.loop[1], t), ringA = 1 - sm(T.loop[1] + 1.0, T.loop[1] + 1.5, t)
    if (ringP > 0 && ringA > 0) loopRing(x, c, L, ringP, ringA, false)
    chip(x, c, L)
    if (ringP > 0 && ringA > 0) loopRing(x, c, L, ringP, ringA, true)

    // ---- beat 1: hook, then shrink to the corner header
    {
      const fade = 1 - sm(T.sweep[0] - 0.4, T.sweep[0], t)
      const m = io(sm(T.head[0], T.head[1], t))
      const ia = (1 - sm(T.head[0] - 0.1, T.head[0] + 0.3, t)) * fade
      if (ia > 0) words(x, [{ s: 'Introducing', t: T.intro, fill: 'grad' }], 640, 252, 600, 34, t, { align: 'center', stops: GV, alpha: ia })
      const list = [{ s: 'code-motion', t: T.name }], px = 128
      const { tot } = wordsW(x, list, 800, px)
      const k = H.lerp(1, 44 / px, m), X = H.lerp(640 - tot / 2, 56, m), Y = H.lerp(370, 82, m)
      if (fade > 0) { x.save(); x.translate(X, Y); x.scale(k, k); words(x, list, 0, 0, 800, px, t, { alpha: H.lerp(1, 0.92, m) * fade }); x.restore() }
    }

    // ---- beat 2: written as code; frame = f(t); synthesized sound
    const b2 = 1 - sm(T.out2[0], T.out2[1], t)
    if (t > T.written[0] - 0.1 && b2 > 0) {
      x.save(); x.globalAlpha = b2
      const dx = c.cx - 860
      words(x, [{ s: 'Written', t: T.written[0] }, { s: 'as', t: T.written[1] }, { s: 'code.', t: T.written[2], fill: 'grad' }], 56, 214, 800, 76, t, { stops: GT })
      // live clock: the frame is drawn from t
      const ta = sm(T.time - 0.15, T.time + 0.2, t)
      if (ta > 0) {
        x.save(); x.globalAlpha *= ta; setF(x, 800, 72)
        const s = `t = ${t.toFixed(2)} s`, w = x.measureText(s).width
        x.shadowColor = 'rgba(60,170,255,0.55)'; x.shadowBlur = 30; x.fillStyle = grad(x, 56, 56 + w, GT); x.fillText(s, 56, 330); x.shadowBlur = 0; x.fillText(s, 56, 330)
        x.restore()
        label(x, 'frame = draw(t)', 58, 376, 400, 30, GREY, 'left', ta * b2)
      }
      const aRow = c.P(-0.3, yT, ROWS[2].z), aEdge = c.P(0.7, L.hover - THICK * 0.2, 1.0)
      callout(x, [aRow, [aRow[0] - 70, 560], [470 + dx * 0.2, 560]], sm(T.frame, T.frame + 0.85, t), 'visuals.js', 'canvas, every frame', 'l')
      callout(x, [aEdge, [aEdge[0] - 40, 640], [aEdge[0] - 110, 640]], sm(T.sound, T.sound + 0.85, t), 'score.js', 'synthesized sound', 'l')
      x.restore()
    }

    // ---- beat 3: style cards stream into the slab; the giant 86
    const b3 = 1 - sm(T.out3[0], T.out3[1], t)
    if (t > T.cards[0] && b3 > 0) {
      x.save(); x.globalAlpha = b3
      const P0 = [-170, 760], P1 = [260, 700], P2 = [520, 600], P3 = [top[0] - 20, top[1] - 4]
      arrow(x, bez(P0, P1, P2, P3, 60).slice(10, 57), sm(T.cards[0], T.cards[0] + 0.6, t), 'rgba(255,255,255,0.3)', 1.2)
      for (let i = 0; i < T.cards.length; i++) {
        const u = (t - T.cards[i]) / T.travel
        if (u <= 0 || u >= 1) continue
        const v = H.ease.inOut(u) * 0.9 + u * 0.1, p = bezAt(P0, P1, P2, P3, v)
        const s = v < 0.42 ? H.lerp(1.6, 1.0, v / 0.42) : H.lerp(1.0, 0.08, Math.pow((v - 0.42) / 0.58, 1.25))
        const blur = v < 0.38 ? H.lerp(9, 0, v / 0.38) : v > 0.85 ? (v - 0.85) * 20 : 0
        const a = Math.min(1, u * 6) * (1 - sm(0.86, 1, v))
        drawCard(x, i, p[0], p[1], s, blur, H.lerp(-0.2, 0.12, v) + Math.sin(i * 2.1) * 0.06, a)
      }
      // 86: counts up as it is spoken, locks with a bloom and a gleam
      const p = eo(sm(T.cnt[0], T.cnt[1], t)), val = Math.round(86 * p)
      const lk = t > T.cnt[1] ? Math.exp(-(t - T.cnt[1]) * 2.2) : 0, zoom = 1 + 0.05 * sm(T.cnt[1], T.cnt[1] + 0.5, t) + 0.035 * lk
      const na = sm(T.cnt[0] - 0.25, T.cnt[0] + 0.05, t)
      if (na > 0) {
        const s = String(val)
        x.save(); x.translate(64, 400); x.scale(zoom, zoom); x.globalAlpha *= na; setF(x, 800, 220)
        const w = x.measureText(s).width
        x.shadowColor = `rgba(220,110,255,${0.5 + 0.4 * lk})`; x.shadowBlur = 50 + 60 * lk; x.fillStyle = grad(x, 0, Math.max(w, 200), GV); x.fillText(s, 0, 0)
        x.shadowBlur = 0; x.fillText(s, 0, 0); x.restore()
        const gp = sm(T.cnt[1] + 0.05, T.cnt[1] + 0.55, t)
        if (gp > 0 && gp < 1) {
          GL = fullLayer(GL); const g2 = GL.getContext('2d')
          g2.save(); g2.translate(64, 400); g2.scale(zoom, zoom); setF(g2, 800, 220); g2.fillStyle = '#fff'; g2.fillText(s, 0, 0); g2.restore()
          g2.globalCompositeOperation = 'source-in'
          const bx = 64 - 200 + gp * (w * zoom + 400), gg = g2.createLinearGradient(bx - 90, 0, bx + 90, 0)
          gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(0.5, 'rgba(255,255,255,0.85)'); gg.addColorStop(1, 'rgba(255,255,255,0)')
          g2.fillStyle = gg; g2.fillRect(0, 0, 1280, 720)
          x.drawImage(GL, 0, 0, 1280, 720)
        }
      }
      label(x, 'looks', 70, 456, 600, 40, INK, 'left', sm(T.looks, T.looks + 0.35, t))
      label(x, 'from the AI Style Atlas', 70, 500, 400, 30, GREY, 'left', sm(T.atlas, T.atlas + 0.45, t))
      x.restore()
    }

    // ---- beat 4: storyboard -> code -> MP4; no video editor
    const b4 = sm(T.out3[1] - 0.1, T.out3[1] + 0.4, t) * (1 - sm(T.out4[0], T.out4[1], t)), dx4 = c.cx - 640
    if (b4 > 0) {
      x.save(); x.globalAlpha = b4; x.translate(dx4 * 0.9, 0)
      const sx = 175, sy = 400, bIn = eo(sm(T.board, T.board + 0.5, t))
      panel(x, sx - (1 - bIn) * 60, sy, 230, 170, bIn, (p, w, h) => {
        const cols = [GV, GT, GG, ['#ff9a4d', '#e879f9'], ['#6d7cff', '#5eead4'], ['#b69cff', '#ff9a4d']]
        for (let i = 0; i < 6; i++) {
          const cx0 = 14 + (i % 3) * 70, cy0 = 16 + ((i / 3) | 0) * 72, pw = 62, ph = 62
          const g = p.createLinearGradient(cx0, cy0, cx0 + pw, cy0 + ph); g.addColorStop(0, cols[i][0]); g.addColorStop(1, cols[i][cols[i].length - 1])
          p.globalAlpha = 0.35 + 0.65 * sm(T.board + i * 0.06, T.board + i * 0.06 + 0.2, t); p.fillStyle = g; p.beginPath(); p.roundRect(cx0, cy0, pw, ph, 8); p.fill()
          p.fillStyle = 'rgba(255,255,255,0.75)'; p.beginPath(); p.arc(cx0 + 22 + (i % 2) * 18, cy0 + 26, 8, 0, 7); p.fill(); p.fillRect(cx0 + 10, cy0 + 44, 40, 5)
        }
        p.globalAlpha = 1
      })
      check(x, sx + 104, sy - 76, 18, eo(sm(T.inArrow[0] - 0.2, T.inArrow[0] + 0.1, t)))
      callout(x, [[sx, sy - 92], [sx, 214], [sx + 24, 214]], sm(T.board, T.board + 0.75, t), '01  Storyboard', 'you approve it', 'r')
      const L0 = c.P(-1.0, yT, 0.05), R0 = c.P(1.0, yT, -0.05)
      arrow(x, bez([sx + 122, sy], [sx + 175, sy], [L0[0] - 70 - dx4 * 0.9, L0[1]], [L0[0] - 14 - dx4 * 0.9, L0[1]], 24), sm(T.inArrow[0], T.inArrow[1], t), 'rgba(255,255,255,0.6)', 1.3)
      const an = c.P(0.1, yT, ROWS[1].z)
      const c4p = sm(T.writes, T.writes + 0.75, t)
      callout(x, [[an[0] - dx4 * 0.9, an[1]], [an[0] + 20 - dx4 * 0.9, 150], [an[0] + 60 - dx4 * 0.9, 150]], c4p, '02  Code', 'by your coding agent', 'r')
      if (c4p > 0.4) {
        const agAlpha = eo(sm(0.4, 1.0, c4p))
        x.save()
        x.globalAlpha = b4 * agAlpha
        const agX0 = an[0] + 74 - dx4 * 0.9, agY0 = 212
        const ags = [
          { key: 'claude', name: 'Claude' },
          { key: 'codex', name: 'Codex' },
          { key: 'cursor', name: 'Cursor' }
        ]
        let curX = agX0
        setF(x, 600, 14)
        const ph = 30, iconSz = 18
        ags.forEach((ag) => {
          const tw = x.measureText(ag.name).width
          const pw = 10 + iconSz + 8 + tw + 12
          x.fillStyle = '#ffffff'
          x.strokeStyle = 'rgba(255,255,255,0.4)'
          x.shadowColor = 'rgba(0,0,0,0.3)'
          x.shadowBlur = 8
          x.lineWidth = 1
          x.beginPath(); x.roundRect(curX, agY0, pw, ph, 15); x.fill(); x.stroke()
          x.shadowBlur = 0
          if (window.LAUNCH_LOGOS?.[ag.key]) {
            x.drawImage(window.LAUNCH_LOGOS[ag.key], curX + 10, agY0 + (ph - iconSz) / 2, iconSz, iconSz)
          }
          x.fillStyle = '#1d1d1f'
          x.textAlign = 'left'
          x.textBaseline = 'middle'
          x.fillText(ag.name, curX + 10 + iconSz + 8, agY0 + ph / 2 + 1)
          curX += pw + 10
        })
        x.restore()
      }
      const ox = 1105, oy = 400, mIn = eo(sm(T.mp4, T.mp4 + 0.5, t))
      arrow(x, bez([R0[0] + 14 - dx4 * 0.9, R0[1]], [R0[0] + 50 - dx4 * 0.9, R0[1]], [ox - 190, oy], [ox - 132, oy], 24), sm(T.outArrow[0], T.outArrow[1], t), 'rgba(255,255,255,0.6)', 1.3)
      panel(x, ox + (1 - mIn) * 60, oy, 240, 150, mIn, (p, w, h) => {
        const g = p.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 160); g.addColorStop(0, '#2a1d3a'); g.addColorStop(1, '#07070b'); p.fillStyle = g; p.fillRect(0, 0, w, h)
        const tg = p.createLinearGradient(100, 40, 150, 90); GV.forEach((s, i) => tg.addColorStop(i / 2, s))
        p.fillStyle = tg; p.shadowColor = 'rgba(220,120,255,0.8)'; p.shadowBlur = 18; p.beginPath(); p.moveTo(102, 46); p.lineTo(146, 72); p.lineTo(102, 98); p.closePath(); p.fill(); p.shadowBlur = 0
        p.fillStyle = 'rgba(255,255,255,0.22)'; p.fillRect(16, h - 22, w - 32, 4)
        const pr = sm(T.mp4, T.mp4 + 3.5, t); p.fillStyle = grad(p, 16, w - 16, GV); p.fillRect(16, h - 22, (w - 32) * pr, 4)
        p.fillStyle = 'rgba(0,0,0,0.55)'; p.beginPath(); p.roundRect(12, 12, 76, 34, 17); p.fill(); p.fillStyle = '#fff'; p.font = '600 22px "Inter"'; p.textAlign = 'center'; p.textBaseline = 'middle'; p.fillText('MP4', 50, 30)
      })
      callout(x, [[ox, oy + 84], [ox, 560], [ox - 24, 560]], sm(T.mp4, T.mp4 + 0.75, t), '03  Render', 'Remotion, to MP4', 'l')
      x.restore()
    }
    // "video editor" struck, then "git" (carries across beats 4 and 5)
    const bw = sm(T.editor - 0.1, T.editor + 0.2, t) * (1 - sm(T.out4[0], T.out4[1], t))
    if (bw > 0) {
      x.save(); x.globalAlpha = bw
      const ex = 300, ey = 676
      const r = words(x, [{ s: 'video', t: T.editor + 0.2, fill: GREY }, { s: 'editor', t: T.editor + 0.55, fill: GREY }], ex, ey, 800, 64, t, {})
      const sp = sm(T.strike[0], T.strike[1], t)
      if (sp > 0) { x.strokeStyle = RED; x.lineWidth = 7; x.lineCap = 'round'; x.shadowColor = 'rgba(255,69,58,0.6)'; x.shadowBlur = 14; x.beginPath(); x.moveTo(ex - 8, ey - 22); x.lineTo(ex - 8 + (r.tot + 16) * io(sp), ey - 22); x.stroke(); x.shadowBlur = 0 }
      const xm = eo(sm(T.xmark, T.xmark + 0.3, t))
      if (xm > 0) { const mx = ex + r.tot + 50, my = ey - 22, rad = 26 * (0.6 + 0.4 * xm); x.save(); x.globalAlpha *= xm; x.strokeStyle = RED; x.lineWidth = 3.5; x.beginPath(); x.arc(mx, my, rad, 0, 7); x.stroke(); x.beginPath(); x.moveTo(mx - 9, my - 9); x.lineTo(mx + 9, my + 9); x.moveTo(mx + 9, my - 9); x.lineTo(mx - 9, my + 9); x.stroke(); x.restore() }
      if (t > T.git) {
        const gx = ex + r.tot + 140
        const gitImg = window.LAUNCH_LOGOS?.git
        if (gitImg) {
          x.save()
          x.globalAlpha = eo(sm(T.git + 0.05, T.git + 0.35, t))
          x.drawImage(gitImg, gx - 46, ey - 48, 38, 38)
          x.restore()
        }
        const g = words(x, [{ s: 'git', t: T.git, fill: 'grad' }], gx, ey, 800, 64, t, { stops: GG })
        x.save(); x.shadowColor = 'rgba(60,230,170,0.6)'; x.shadowBlur = 24 * Math.exp(-(t - T.git) * 2); check(x, gx + g.tot + 44, ey - 22, 26 * (0.6 + 0.4 * eo(sm(T.git + 0.1, T.git + 0.4, t))), eo(sm(T.git + 0.1, T.git + 0.4, t))); x.restore()
      }
      x.restore()
    }

    // ---- beat 5: review in a pull request; render again any time
    const b5 = sm(T.out4[0] + 0.2, T.out4[1] + 0.3, t) * (1 - sm(T.sweep[0] - 0.3, T.sweep[0] + 0.1, t)), dx5 = c.cx - 900
    if (b5 > 0) {
      x.save(); x.globalAlpha = b5; x.translate(dx5 * 0.9, 0)
      const px0 = 290, py0 = 360, pIn = eo(sm(T.pr, T.pr + 0.5, t))
      panel(x, px0 - (1 - pIn) * 60, py0, 400, 250, pIn, (p, w, h) => {
        p.fillStyle = 'rgba(255,255,255,0.06)'; p.fillRect(0, 0, w, 52)
        const gitImg = window.LAUNCH_LOGOS?.git
        if (gitImg) {
          p.drawImage(gitImg, 18, 14, 24, 24)
        }
        p.fillStyle = '#e6e6ea'; p.font = `600 24px ${MONO}`; p.textBaseline = 'middle'; p.fillText('git diff visuals.js', gitImg ? 50 : 20, 27)
        const rows = [['+', 0.78], ['+', 0.55], ['-', 0.62], ['+', 0.7], [' ', 0.5], ['-', 0.4]]
        rows.forEach(([s, len], i) => {
          const yy = 76 + i * 28, on = sm(T.pr + 0.15 + i * 0.07, T.pr + 0.35 + i * 0.07, t)
          p.globalAlpha = on
          if (s !== ' ') { p.fillStyle = s === '+' ? 'rgba(47,214,160,0.14)' : 'rgba(255,69,58,0.14)'; p.fillRect(0, yy - 13, w, 26) }
          p.fillStyle = s === '+' ? '#2fd6a0' : s === '-' ? '#ff6a5c' : '#6e6e73'; p.font = `600 22px ${MONO}`; p.fillText(s === '-' ? '−' : s, 18, yy)
          p.fillStyle = s === '+' ? 'rgba(160,240,210,0.8)' : s === '-' ? 'rgba(255,170,160,0.8)' : 'rgba(200,200,210,0.5)'; p.fillRect(44, yy - 3, (w - 70) * len, 6)
          p.globalAlpha = 1
        })
      })
      callout(x, [[px0 + 120, py0 - 125], [px0 + 120, 172], [px0 + 144, 172]], sm(T.prLabel, T.prLabel + 0.75, t), 'Review it in a PR', 'every change is a diff', 'r')
      // render again: the loop ring around the slab, labelled
      const ringP = sm(T.loop[0], T.loop[1], t)
      if (ringP > 0.05) {
        const fr = c.P(1.42 * Math.cos(2.3), L.hover, 1.42 * Math.sin(2.3)), fx = fr[0] - dx5 * 0.9
        callout(x, [[fx, fr[1]], [fx - 40, 600], [480, 600]], sm(T.rerender - 0.1, T.rerender + 0.65, t), 'Re-render any time', 'same code in, same video out', 'l')
      }
      x.restore()
    }
  }

  // ================= DARK STAGE: PORTRAIT (9:16) =================
  function darkScenePortrait(x, Wd, Hh, t, c, L) {
    stage(x, Wd, Hh, c, L, t)
    const yT = L.hover + THICK / 2, top = c.P(0, yT, 0)
    const ringP = sm(T.loop[0], T.loop[1], t), ringA = 1 - sm(T.loop[1] + 1.0, T.loop[1] + 1.5, t)
    if (ringP > 0 && ringA > 0) loopRing(x, c, L, ringP, ringA, false)
    chip(x, c, L)
    if (ringP > 0 && ringA > 0) loopRing(x, c, L, ringP, ringA, true)

    // ---- beat 1: hook, then shrink to the top header
    {
      const fade = (1 - sm(T.sweep[0] - 0.4, T.sweep[0], t)) * (1 - sm(T.out3[0] + 0.1, T.out3[0] + 0.5, t))
      const m = io(sm(T.head[0], T.head[1], t))
      const ia = (1 - sm(T.head[0] - 0.1, T.head[0] + 0.3, t)) * fade
      if (ia > 0) words(x, [{ s: 'Introducing', t: T.intro, fill: 'grad' }], 360, 290, 600, 36, t, { align: 'center', stops: GV, alpha: ia })
      const list = [{ s: 'code-motion', t: T.name }], px = 100
      const { tot } = wordsW(x, list, 800, px)
      const k = H.lerp(1, 38 / px, m), X = H.lerp(360 - tot / 2, 360 - (tot * (38 / px)) / 2, m), Y = H.lerp(380, 80, m)
      if (fade > 0) { x.save(); x.translate(X, Y); x.scale(k, k); words(x, list, 0, 0, 800, px, t, { alpha: H.lerp(1, 0.92, m) * fade }); x.restore() }
    }

    // ---- beat 2: written as code; frame = f(t); synthesized sound
    const b2 = 1 - sm(T.out2[0], T.out2[1], t)
    if (t > T.written[0] - 0.1 && b2 > 0) {
      x.save(); x.globalAlpha = b2
      words(x, [{ s: 'Written', t: T.written[0] }, { s: 'as', t: T.written[1] }, { s: 'code.', t: T.written[2], fill: 'grad' }], 360, 190, 800, 56, t, { align: 'center', stops: GT })
      const ta = sm(T.time - 0.15, T.time + 0.2, t)
      if (ta > 0) {
        x.save(); x.globalAlpha *= ta; setF(x, 800, 56)
        const s = `t = ${t.toFixed(2)} s`, w = x.measureText(s).width
        x.shadowColor = 'rgba(60,170,255,0.55)'; x.shadowBlur = 24; x.fillStyle = grad(x, 360 - w / 2, 360 + w / 2, GT); x.fillText(s, 360 - w / 2, 270); x.shadowBlur = 0; x.fillText(s, 360 - w / 2, 270)
        x.restore()
        label(x, 'frame = draw(t)', 360, 310, 400, 24, GREY, 'center', ta * b2)
      }
      const aRow = c.P(-0.3, yT, ROWS[2].z), aEdge = c.P(0.7, L.hover - THICK * 0.2, 1.0)
      callout(x, [aRow, [aRow[0] - 50, 990], [180, 990]], sm(T.frame, T.frame + 0.85, t), 'visuals.js', 'canvas, every frame', 'l', { px: 26, subPx: 22 })
      callout(x, [aEdge, [aEdge[0] + 50, 990], [540, 990]], sm(T.sound, T.sound + 0.85, t), 'score.js', 'synthesized sound', 'r', { px: 26, subPx: 22 })
      x.restore()
    }

    // ---- beat 3: style cards stream into the slab; the giant 86
    const b3 = 1 - sm(T.out3[0], T.out3[1], t)
    if (t > T.cards[0] && b3 > 0) {
      x.save(); x.globalAlpha = b3
      const P0 = [560, 100], P1 = [620, 380], P2 = [480, 640], P3 = [top[0] - 10, top[1] - 4]
      arrow(x, bez(P0, P1, P2, P3, 60).slice(10, 57), sm(T.cards[0], T.cards[0] + 0.6, t), 'rgba(255,255,255,0.3)', 1.2)
      for (let i = 0; i < T.cards.length; i++) {
        const u = (t - T.cards[i]) / T.travel
        if (u <= 0 || u >= 1) continue
        const v = H.ease.inOut(u) * 0.9 + u * 0.1, p = bezAt(P0, P1, P2, P3, v)
        const s = v < 0.42 ? H.lerp(1.4, 0.9, v / 0.42) : H.lerp(0.9, 0.08, Math.pow((v - 0.42) / 0.58, 1.25))
        const blur = v < 0.38 ? H.lerp(8, 0, v / 0.38) : v > 0.85 ? (v - 0.85) * 18 : 0
        const a = Math.min(1, u * 6) * (1 - sm(0.86, 1, v))
        drawCard(x, i, p[0], p[1], s, blur, H.lerp(-0.2, 0.12, v) + Math.sin(i * 2.1) * 0.06, a)
      }
      const p = eo(sm(T.cnt[0], T.cnt[1], t)), val = Math.round(86 * p)
      const lk = t > T.cnt[1] ? Math.exp(-(t - T.cnt[1]) * 2.2) : 0, zoom = 1 + 0.05 * sm(T.cnt[1], T.cnt[1] + 0.5, t) + 0.035 * lk
      const na = sm(T.cnt[0] - 0.25, T.cnt[0] + 0.05, t)
      if (na > 0) {
        const s = String(val)
        x.save(); setF(x, 800, 160)
        const w = x.measureText(s).width
        x.translate(360 - (w * zoom) / 2, 280); x.scale(zoom, zoom); x.globalAlpha *= na
        x.shadowColor = `rgba(220,110,255,${0.5 + 0.4 * lk})`; x.shadowBlur = 40 + 50 * lk; x.fillStyle = grad(x, 0, Math.max(w, 160), GV); x.fillText(s, 0, 0)
        x.shadowBlur = 0; x.fillText(s, 0, 0); x.restore()
        const gp = sm(T.cnt[1] + 0.05, T.cnt[1] + 0.55, t)
        if (gp > 0 && gp < 1) {
          GL = fullLayer(GL); const g2 = GL.getContext('2d')
          g2.save(); g2.translate(360 - (w * zoom) / 2, 280); g2.scale(zoom, zoom); setF(g2, 800, 160); g2.fillStyle = '#fff'; g2.fillText(s, 0, 0); g2.restore()
          g2.globalCompositeOperation = 'source-in'
          const bx = 360 - 200 + gp * (w * zoom + 400), gg = g2.createLinearGradient(bx - 90, 0, bx + 90, 0)
          gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(0.5, 'rgba(255,255,255,0.85)'); gg.addColorStop(1, 'rgba(255,255,255,0)')
          g2.fillStyle = gg; g2.fillRect(0, 0, BASE_W, BASE_H)
          x.drawImage(GL, 0, 0, BASE_W, BASE_H)
        }
      }
      label(x, 'looks', 360, 345, 600, 36, INK, 'center', sm(T.looks, T.looks + 0.35, t))
      label(x, 'from the AI Style Atlas', 360, 390, 400, 26, GREY, 'center', sm(T.atlas, T.atlas + 0.45, t))
      x.restore()
    }

    // ---- beat 4: storyboard -> code -> MP4; no video editor
    const b4 = sm(T.out3[1] - 0.1, T.out3[1] + 0.4, t) * (1 - sm(T.out4[0], T.out4[1], t))
    if (b4 > 0) {
      x.save(); x.globalAlpha = b4
      const sx = 360, sy = 190, bIn = eo(sm(T.board, T.board + 0.5, t))
      panel(x, sx, sy - (1 - bIn) * 40, 220, 140, bIn, (p, w, h) => {
        const cols = [GV, GT, GG, ['#ff9a4d', '#e879f9'], ['#6d7cff', '#5eead4'], ['#b69cff', '#ff9a4d']]
        for (let i = 0; i < 6; i++) {
          const cx0 = 12 + (i % 3) * 68, cy0 = 14 + ((i / 3) | 0) * 60, pw = 60, ph = 52
          const g = p.createLinearGradient(cx0, cy0, cx0 + pw, cy0 + ph); g.addColorStop(0, cols[i][0]); g.addColorStop(1, cols[i][cols[i].length - 1])
          p.globalAlpha = 0.35 + 0.65 * sm(T.board + i * 0.06, T.board + i * 0.06 + 0.2, t); p.fillStyle = g; p.beginPath(); p.roundRect(cx0, cy0, pw, ph, 7); p.fill()
          p.fillStyle = 'rgba(255,255,255,0.75)'; p.beginPath(); p.arc(cx0 + 20 + (i % 2) * 16, cy0 + 22, 7, 0, 7); p.fill(); p.fillRect(cx0 + 10, cy0 + 36, 38, 4)
        }
        p.globalAlpha = 1
      })
      check(x, sx + 98, sy - (1 - bIn) * 40 - 64, 16, eo(sm(T.inArrow[0] - 0.2, T.inArrow[0] + 0.1, t)))
      callout(x, [[sx, sy - 74], [sx, 68], [sx + 20, 68]], sm(T.board, T.board + 0.75, t), '01  Storyboard', 'you approve it', 'r', { px: 24, subPx: 20 })
      
      arrow(x, [[sx, sy + 74], [sx, 440]], sm(T.inArrow[0], T.inArrow[1], t), 'rgba(255,255,255,0.6)', 1.3)
      callout(x, [[360, 480], [430, 440], [450, 440]], sm(T.writes, T.writes + 0.75, t), '02  Code', 'by your coding agent', 'r', { px: 24, subPx: 20 })
      
      const c4p = sm(T.writes, T.writes + 0.75, t)
      if (c4p > 0.4) {
        const agAlpha = eo(sm(0.4, 1.0, c4p))
        x.save()
        x.globalAlpha = b4 * agAlpha
        const ags = [
          { key: 'claude', name: 'Claude' },
          { key: 'codex', name: 'Codex' },
          { key: 'cursor', name: 'Cursor' }
        ]
        setF(x, 600, 14)
        const ph = 28, iconSz = 16
        const ws = ags.map(ag => 10 + iconSz + 8 + x.measureText(ag.name).width + 12)
        const totAgW = ws.reduce((a, b) => a + b, 0) + 16
        let curX = 360 - totAgW / 2, agY0 = 746
        ags.forEach((ag, idx) => {
          const pw = ws[idx]
          x.fillStyle = '#ffffff'; x.strokeStyle = 'rgba(255,255,255,0.4)'; x.shadowColor = 'rgba(0,0,0,0.3)'; x.shadowBlur = 8; x.lineWidth = 1
          x.beginPath(); x.roundRect(curX, agY0, pw, ph, 14); x.fill(); x.stroke(); x.shadowBlur = 0
          if (window.LAUNCH_LOGOS?.[ag.key]) x.drawImage(window.LAUNCH_LOGOS[ag.key], curX + 10, agY0 + (ph - iconSz) / 2, iconSz, iconSz)
          x.fillStyle = '#1d1d1f'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(ag.name, curX + 10 + iconSz + 8, agY0 + ph / 2 + 1)
          curX += pw + 8
        })
        x.restore()
      }

      const ox = 360, oy = 890, mIn = eo(sm(T.mp4, T.mp4 + 0.5, t))
      arrow(x, [[360, 786], [360, oy - 74]], sm(T.outArrow[0], T.outArrow[1], t), 'rgba(255,255,255,0.6)', 1.3)
      panel(x, ox, oy + (1 - mIn) * 30, 240, 136, mIn, (p, w, h) => {
        const g = p.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 150); g.addColorStop(0, '#2a1d3a'); g.addColorStop(1, '#07070b'); p.fillStyle = g; p.fillRect(0, 0, w, h)
        const tg = p.createLinearGradient(100, 35, 145, 80); GV.forEach((s, i) => tg.addColorStop(i / 2, s))
        p.fillStyle = tg; p.shadowColor = 'rgba(220,120,255,0.8)'; p.shadowBlur = 16; p.beginPath(); p.moveTo(102, 42); p.lineTo(144, 66); p.lineTo(102, 90); p.closePath(); p.fill(); p.shadowBlur = 0
        p.fillStyle = 'rgba(255,255,255,0.22)'; p.fillRect(16, h - 20, w - 32, 4)
        const pr = sm(T.mp4, T.mp4 + 3.5, t); p.fillStyle = grad(p, 16, w - 16, GV); p.fillRect(16, h - 20, (w - 32) * pr, 4)
        p.fillStyle = 'rgba(0,0,0,0.55)'; p.beginPath(); p.roundRect(12, 10, 72, 32, 16); p.fill(); p.fillStyle = '#fff'; p.font = '600 20px "Inter"'; p.textAlign = 'center'; p.textBaseline = 'middle'; p.fillText('MP4', 48, 26)
      })
      const mp4La = sm(T.mp4, T.mp4 + 0.75, t)
      if (mp4La > 0) {
        label(x, '03  Render', 360, oy + 94, 600, 22, '#ffffff', 'center', mp4La)
        label(x, 'Remotion, to MP4', 360, oy + 116, 400, 18, GREY, 'center', mp4La)
      }

      const bw = sm(T.editor - 0.1, T.editor + 0.2, t)
      if (bw > 0) {
        x.save(); x.globalAlpha = bw
        const ex = 190, ey = 1070
        const r = words(x, [{ s: 'video', t: T.editor + 0.2, fill: GREY }, { s: 'editor', t: T.editor + 0.55, fill: GREY }], ex, ey, 800, 48, t, {})
        const sp = sm(T.strike[0], T.strike[1], t)
        if (sp > 0) { x.strokeStyle = RED; x.lineWidth = 5; x.lineCap = 'round'; x.shadowColor = 'rgba(255,69,58,0.6)'; x.shadowBlur = 12; x.beginPath(); x.moveTo(ex - 6, ey - 16); x.lineTo(ex - 6 + (r.tot + 12) * io(sp), ey - 16); x.stroke(); x.shadowBlur = 0 }
        const xm = eo(sm(T.xmark, T.xmark + 0.3, t))
        if (xm > 0) { const mx = ex + r.tot + 36, my = ey - 16, rad = 20 * (0.6 + 0.4 * xm); x.save(); x.globalAlpha *= xm; x.strokeStyle = RED; x.lineWidth = 3; x.beginPath(); x.arc(mx, my, rad, 0, 7); x.stroke(); x.beginPath(); x.moveTo(mx - 7, my - 7); x.lineTo(mx + 7, my + 7); x.moveTo(mx + 7, my - 7); x.lineTo(mx - 7, my + 7); x.stroke(); x.restore() }
        if (t > T.git) {
          const gx = ex + r.tot + 104
          const gitImg = window.LAUNCH_LOGOS?.git
          if (gitImg) {
            x.save(); x.globalAlpha = eo(sm(T.git + 0.05, T.git + 0.35, t)); x.drawImage(gitImg, gx - 36, ey - 36, 28, 28); x.restore()
          }
          const g = words(x, [{ s: 'git', t: T.git, fill: 'grad' }], gx, ey, 800, 48, t, { stops: GG })
          x.save(); x.shadowColor = 'rgba(60,230,170,0.6)'; x.shadowBlur = 20 * Math.exp(-(t - T.git) * 2); check(x, gx + g.tot + 32, ey - 16, 20 * (0.6 + 0.4 * eo(sm(T.git + 0.1, T.git + 0.4, t))), eo(sm(T.git + 0.1, T.git + 0.4, t))); x.restore()
        }
        x.restore()
      }
      x.restore()
    }

    // ---- beat 5: review in a PR
    const b5 = sm(T.out4[0] + 0.2, T.out4[1] + 0.3, t) * (1 - sm(T.sweep[0] - 0.3, T.sweep[0] + 0.1, t))
    if (b5 > 0) {
      x.save(); x.globalAlpha = b5
      const px0 = 360, py0 = 300, pIn = eo(sm(T.pr, T.pr + 0.5, t))
      panel(x, px0, py0 - (1 - pIn) * 40, 420, 230, pIn, (p, w, h) => {
        p.fillStyle = 'rgba(255,255,255,0.06)'; p.fillRect(0, 0, w, 48)
        const gitImg = window.LAUNCH_LOGOS?.git
        if (gitImg) p.drawImage(gitImg, 18, 12, 24, 24)
        p.fillStyle = '#e6e6ea'; p.font = `600 22px ${MONO}`; p.textBaseline = 'middle'; p.fillText('git diff visuals.js', gitImg ? 50 : 20, 24)
        const rows = [['+', 0.78], ['+', 0.55], ['-', 0.62], ['+', 0.7], [' ', 0.5], ['-', 0.4]]
        rows.forEach(([s, len], i) => {
          const yy = 68 + i * 26, on = sm(T.pr + 0.15 + i * 0.07, T.pr + 0.35 + i * 0.07, t)
          p.globalAlpha = on
          if (s !== ' ') { p.fillStyle = s === '+' ? 'rgba(47,214,160,0.14)' : 'rgba(255,69,58,0.14)'; p.fillRect(0, yy - 12, w, 24) }
          p.fillStyle = s === '+' ? '#2fd6a0' : s === '-' ? '#ff6a5c' : '#6e6e73'; p.font = `600 20px ${MONO}`; p.fillText(s === '-' ? '−' : s, 18, yy)
          p.fillStyle = s === '+' ? 'rgba(160,240,210,0.8)' : s === '-' ? 'rgba(255,170,160,0.8)' : 'rgba(200,200,210,0.5)'; p.fillRect(44, yy - 3, (w - 70) * len, 5)
          p.globalAlpha = 1
        })
      })
      callout(x, [[px0, py0 - 115], [px0, 120], [px0 + 20, 120]], sm(T.prLabel, T.prLabel + 0.75, t), 'Review it in a PR', 'every change is a diff', 'r', { px: 28, subPx: 22 })
      const ringP = sm(T.loop[0], T.loop[1], t)
      if (ringP > 0.05) {
        callout(x, [[360, 940], [360, 1060], [360 - 20, 1060]], sm(T.rerender - 0.1, T.rerender + 0.65, t), 'Re-render any time', 'same code in, same video out', 'l', { px: 28, subPx: 22 })
      }
      x.restore()
    }
  }

  // ================= WHITE STAGE: tagline (LANDSCAPE) =================
  function whiteScene(x, Wd, Hh, t, c, L) {
    const Lw = Object.assign({}, L, { white: 1, key: 1, rim: 1 })
    stage(x, Wd, Hh, c, Lw, t)
    chip(x, c, Lw)
    const list = [{ s: 'code-', t: T.tagName[0], fill: '#1d1d1f' }, { s: 'motion', t: T.tagName[1], fill: 'grad' }]
    setF(x, 800, 100); const w1 = x.measureText('code-').width, w2 = x.measureText('motion').width, X0 = 640 - (w1 + w2) / 2
    words(x, [list[0]], X0, 150, 800, 100, t, {})
    words(x, [list[1]], X0 + w1, 150, 800, 100, t, { stops: ['#7c4dff', '#d946ef', '#ff7a2f'] })
    label(x, 'Product videos, written as code.', 640, 206, 400, 32, '#6e6e73', 'center', sm(T.tagName[1] + 0.3, T.tagName[1] + 0.8, t))

    const items = [
      { name: 'Claude Code', key: 'claude' },
      { name: 'Codex', key: 'codex' },
      { name: 'Cursor', key: 'cursor' },
      { name: '+ more', key: null }
    ]
    x.save(); setF(x, 600, 28)
    const iconSize = 28
    const ws = items.map((it) => x.measureText(it.name).width + (it.key ? iconSize + 14 : 0) + 44)
    const gap = 16, tot = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1)
    let px = 640 - tot / 2
    items.forEach((it, i) => {
      const e = eo((t - T.pills[i]) / 0.45)
      if (e > 0.001) {
        x.globalAlpha = e; const yy = 262 + (1 - e) * 10
        x.fillStyle = i === 3 ? 'rgba(29,29,31,0.06)' : '#ffffff'; x.strokeStyle = 'rgba(29,29,31,0.18)'; x.lineWidth = 1
        x.shadowColor = 'rgba(0,0,0,0.08)'; x.shadowBlur = 12; x.beginPath(); x.roundRect(px, yy, ws[i], 50, 25); x.fill(); x.shadowBlur = 0; x.stroke()
        let tx = px + 22
        if (it.key && window.LAUNCH_LOGOS?.[it.key]) {
          x.drawImage(window.LAUNCH_LOGOS[it.key], tx, yy + (50 - iconSize) / 2, iconSize, iconSize)
          tx += iconSize + 12
        }
        x.fillStyle = '#1d1d1f'; x.textAlign = 'left'; x.textBaseline = 'middle'
        x.fillText(it.name, tx, yy + 26)
      }
      px += ws[i] + gap
    })
    x.restore()

    label(x, 'npx skills add savepong/code-motion-skill', 640, 694, 600, 28, '#3a3a3c', 'center', sm(T.install, T.install + 0.4, t), MONO)
  }

  // ================= WHITE STAGE: tagline (PORTRAIT) =================
  function whiteScenePortrait(x, Wd, Hh, t, c, L) {
    const Lw = Object.assign({}, L, { white: 1, key: 1, rim: 1 })
    stage(x, Wd, Hh, c, Lw, t)
    chip(x, c, Lw)
    const list = [{ s: 'code-', t: T.tagName[0], fill: '#1d1d1f' }, { s: 'motion', t: T.tagName[1], fill: 'grad' }]
    setF(x, 800, 72); const w1 = x.measureText('code-').width, w2 = x.measureText('motion').width, X0 = 360 - (w1 + w2) / 2
    words(x, [list[0]], X0, 190, 800, 72, t, {})
    words(x, [list[1]], X0 + w1, 190, 800, 72, t, { stops: ['#7c4dff', '#d946ef', '#ff7a2f'] })
    label(x, 'Product videos, written as code.', 360, 245, 400, 24, '#6e6e73', 'center', sm(T.tagName[1] + 0.3, T.tagName[1] + 0.8, t))

    const items = [
      { name: 'Claude Code', key: 'claude' },
      { name: 'Codex', key: 'codex' },
      { name: 'Cursor', key: 'cursor' },
      { name: '+ more', key: null }
    ]
    x.save(); setF(x, 600, 22)
    const iconSize = 24
    const grid = [
      { x: 230, y: 300, w: 210 },
      { x: 470, y: 300, w: 170 },
      { x: 230, y: 360, w: 170 },
      { x: 470, y: 360, w: 150 }
    ]
    items.forEach((it, i) => {
      const e = eo((t - T.pills[i]) / 0.45)
      if (e > 0.001) {
        x.globalAlpha = e
        const g = grid[i], yy = g.y + (1 - e) * 8, px = g.x - g.w / 2
        x.fillStyle = i === 3 ? 'rgba(29,29,31,0.06)' : '#ffffff'; x.strokeStyle = 'rgba(29,29,31,0.18)'; x.lineWidth = 1
        x.shadowColor = 'rgba(0,0,0,0.08)'; x.shadowBlur = 10; x.beginPath(); x.roundRect(px, yy, g.w, 44, 22); x.fill(); x.shadowBlur = 0; x.stroke()
        let tx = px + 18
        if (it.key && window.LAUNCH_LOGOS?.[it.key]) {
          x.drawImage(window.LAUNCH_LOGOS[it.key], tx, yy + (44 - iconSize) / 2, iconSize, iconSize)
          tx += iconSize + 10
        }
        x.fillStyle = '#1d1d1f'; x.textAlign = 'left'; x.textBaseline = 'middle'
        x.fillText(it.name, tx, yy + 22)
      }
    })
    x.restore()

    label(x, 'npx skills add savepong/code-motion-skill', 360, 1160, 600, 22, '#3a3a3c', 'center', sm(T.install, T.install + 0.4, t), MONO)
  }

  function explainerLandscape(ctx, Wd, Hh, t) {
    const c = cam(keyed(KEYS, t)), L = lighting(t)
    const [s0, s1] = T.sweep
    if (t < s1) darkScene(ctx, Wd, Hh, t, c, L)
    if (t >= s0) {
      const bx = H.lerp(-260, Wd + 260, io(sm(s0, s1, t)))
      ctx.save()
      if (t < s1) { ctx.beginPath(); ctx.rect(0, 0, Math.max(0, bx), Hh); ctx.clip() }
      whiteScene(ctx, Wd, Hh, t, c, L)
      ctx.restore()
      if (t < s1 + 0.05) {
        const g = ctx.createLinearGradient(bx - 260, 0, bx + 120, 0)
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.9)'); g.addColorStop(0.85, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(bx - 260, 0, 380, Hh); ctx.restore()
      }
    }
    finish(ctx, Wd, Hh, t, t >= s1)
  }

  function explainerPortrait(ctx, Wd, Hh, t) {
    const c = cam(keyed(KEYS_PORTRAIT, t)), L = lighting(t)
    const [s0, s1] = T.sweep
    if (t < s1) darkScenePortrait(ctx, Wd, Hh, t, c, L)
    if (t >= s0) {
      const bx = H.lerp(-200, Wd + 200, io(sm(s0, s1, t)))
      ctx.save()
      if (t < s1) { ctx.beginPath(); ctx.rect(0, 0, Math.max(0, bx), Hh); ctx.clip() }
      whiteScenePortrait(ctx, Wd, Hh, t, c, L)
      ctx.restore()
      if (t < s1 + 0.05) {
        const g = ctx.createLinearGradient(bx - 200, 0, bx + 100, 0)
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.9)'); g.addColorStop(0.85, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(bx - 200, 0, 300, Hh); ctx.restore()
      }
    }
    finish(ctx, Wd, Hh, t, t >= s1)
  }

  function draw(ctx, Wd, Hd, t) {
    if (Hd > Wd) {
      BASE_W = 720
      BASE_H = 1280
      SCALE = Wd / 720
      ctx.save()
      ctx.scale(Wd / 720, Hd / 1280)
      explainerPortrait(ctx, 720, 1280, H.clamp(t, 0, DURATION))
      ctx.restore()
    } else {
      BASE_W = 1280
      BASE_H = 720
      SCALE = Wd / 1280
      ctx.save()
      ctx.scale(Wd / 1280, Hd / 720)
      explainerLandscape(ctx, 1280, 720, H.clamp(t, 0, DURATION))
      ctx.restore()
    }
  }

  window.LAUNCH = { BEATS, WORDS, T, DURATION, STYLES, arrive, sm, io, eo }
  window.VIDEOS = window.VIDEOS || {}
  window.VIDEOS.launch = {
    ...window.VIDEOS.launch,
    draw,
    duration: DURATION,
    width: 1920,
    height: 1080,
    fps: 60,
    voice: 'launch-voice.mp3',
    score: window.LAUNCH_SCORE,
  }
})()
