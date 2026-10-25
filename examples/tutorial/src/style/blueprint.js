// Engineering Blueprint medium, adapted from the Futurepedia AI Style Atlas reference (styles/blueprint.js,
// explainer()). Same paper, speckle, grid, cyanotype exposure, bloom, fold creases, plotter head, grain and
// vignette, at the same strengths; generalised to a world-space sheet of any size and a camera [cx, cy, z].
// Third-party derived: src/style/ is gitignored.
;(function () {
  const BP = {}
  const XC = {} // static texture cache (frames still depend only on t)
  const nz = H.makeNoise(88)

  BP.INK = '#eef4ff'

  // camera keys [[t, cx, cy, z], ...] -> [cx, cy, z]; eased, zoom interpolated in log space (as the reference)
  const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  BP.camAt = (keys, t) => {
    if (t <= keys[0][0]) return keys[0].slice(1)
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1]
      if (t <= b[0]) {
        const u = eio((t - a[0]) / Math.max(1e-6, b[0] - a[0]))
        return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u)]
      }
    }
    return keys[keys.length - 1].slice(1)
  }
  BP.view = (cam, W, H_) => {
    const z = cam[2]
    return {
      z,
      apply: (c) => { c.translate(W / 2, H_ / 2); c.scale(z, z); c.translate(-cam[0], -cam[1]) },
      toS: ([x, y]) => [(x - cam[0]) * z + W / 2, (y - cam[1]) * z + H_ / 2],
      x0: cam[0] - W / 2 / z, x1: cam[0] + W / 2 / z, y0: cam[1] - H_ / 2 / z, y1: cam[1] + H_ / 2 / z,
    }
  }

  // ---------- the sheet: mottled, sun-faded prussian blue, built once at 2 world px per texel ----------
  // S = { x0, y0, x1, y1 } paper edge in world units
  function buildSheet(S) {
    const sw = Math.ceil((S.x1 - S.x0) / 2), sh = Math.ceil((S.y1 - S.y0) / 2)
    const sl = H.layer(sw, sh), sc = sl.getContext('2d'), id = sc.createImageData(sw, sh), d = id.data, base = [22, 58, 112]
    const grid = (step, fn) => {
      const gw = Math.ceil(sw / step) + 2, gh = Math.ceil(sh / step) + 2, G = new Float32Array(gw * gh)
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) G[j * gw + i] = fn(i * step, j * step)
      return (x, y) => {
        const fx = x / step, fy = y / step, i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, o = j * gw + i
        return (G[o] * (1 - u) + G[o + 1] * u) * (1 - v) + (G[o + gw] * (1 - u) + G[o + gw + 1] * u) * v
      }
    }
    const gA = grid(2, (x, y) => nz.fbm2(x * 0.006, y * 0.006, 4) * 0.24)
    const gB = grid(4, (x, y) => Math.max(0, nz.fbm2(x * 0.003 + 40, y * 0.003, 3) - 0.15) * 0.55)
    const VN = 256, vl = new Float32Array(VN * VN), vr = H.rng(881)
    for (let i = 0; i < vl.length; i++) vl[i] = vr() * 2 - 1
    const vn = (x, y) => {
      const ix = Math.floor(x), iy = Math.floor(y), u = x - ix, v = y - iy, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v)
      const x0 = ix & 255, x1 = (ix + 1) & 255, y0 = (iy & 255) * VN, y1 = ((iy + 1) & 255) * VN
      const a = vl[y0 + x0], b = vl[y0 + x1], c2 = vl[y1 + x0], e = vl[y1 + x1]
      return (a + (b - a) * su) * (1 - sv) + (c2 + (e - c2) * su) * sv
    }
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const m = gA(x, y) + (vn(x * 0.06 + 10, y * 0.06) * 0.65 + vn(x * 0.14, y * 0.14 + 7) * 0.35) * 0.07 + gB(x, y)
      const fade = Math.max(0, 1 - Math.hypot(x - 240, y - 160) / 1400) * 0.16 // sun-faded corner
      const wx = x * 2, wy = y * 2, dE = Math.min(wx, sw * 2 - wx, wy, sh * 2 - wy)
      const edge = (1 - H.smooth(0, 230, dE)) * 0.3
      const k = 1 + m + fade - edge, i = (y * sw + x) * 4
      d[i] = base[0] * k + fade * 40; d[i + 1] = base[1] * k + fade * 30; d[i + 2] = base[2] * k + fade * 25; d[i + 3] = 255
    }
    sc.putImageData(id, 0, 0)
    // speckle flaws as a 1024px tile anchored to the paper
    const TS = 1024, tl = H.layer(TS, TS), tc = tl.getContext('2d'), rr = H.rng(4)
    for (let i = 0; i < 1900; i++) {
      tc.fillStyle = rr.chance(0.7) ? `rgba(160,190,230,${rr.range(0.05, 0.25)})` : `rgba(5,20,50,${rr.range(0.1, 0.3)})`
      tc.fillRect(rr.range(0, TS - 2), rr.range(0, TS - 2), rr.range(0.6, 1.8), rr.range(0.6, 1.8))
    }
    // abraded fibres along the fold creases
    const fr = H.rng(31), fib = (vert, len) => {
      const st = vert ? H.layer(24, len) : H.layer(len, 24), fc = st.getContext('2d')
      for (let i = 0; i < 2300 * len / 2600; i++) {
        const a = fr.range(0, len), o = 12 + fr.gauss() * 1.8, sz = fr.range(0.6, 2.2)
        fc.fillStyle = `rgba(200,220,245,${fr.range(0.1, 0.45)})`
        if (vert) fc.fillRect(o, a, sz * 0.7, sz); else fc.fillRect(a, o, sz, sz * 0.7)
      }
      return st
    }
    return { sheet: sl, speck: tl, fib }
  }

  // paper + speckle + fine grid
  BP.paper = (ctx, V, S) => {
    const key = [S.x0, S.y0, S.x1, S.y1].join(',')
    if (XC.key !== key) { Object.assign(XC, buildSheet(S), { key, fibs: {} }) }
    ctx.save(); V.apply(ctx)
    ctx.fillStyle = '#0a1f3f'; ctx.fillRect(V.x0 - 4, V.y0 - 4, V.x1 - V.x0 + 8, V.y1 - V.y0 + 8)
    ctx.imageSmoothingEnabled = true; ctx.drawImage(XC.sheet, S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0)
    ctx.fillStyle = ctx.createPattern(XC.speck, 'repeat'); ctx.fillRect(V.x0 - 4, V.y0 - 4, V.x1 - V.x0 + 8, V.y1 - V.y0 + 8)
    const z = V.z
    for (let x = Math.floor(V.x0 / 40) * 40; x < V.x1; x += 40) { ctx.fillStyle = x % 200 === 0 ? 'rgba(200,220,255,0.10)' : 'rgba(200,220,255,0.045)'; ctx.fillRect(x, V.y0, 1 / z, V.y1 - V.y0) }
    for (let y = Math.floor(V.y0 / 40) * 40; y < V.y1; y += 40) { ctx.fillStyle = y % 200 === 0 ? 'rgba(200,220,255,0.10)' : 'rgba(200,220,255,0.045)'; ctx.fillRect(V.x0, y, V.x1 - V.x0, 1 / z) }
    ctx.restore()
  }

  // uneven exposure + pinhole dropouts on the line layer (anchored to the sheet), then the two-pass bleed
  BP.develop = (ctx, LL, W, H_, cam) => {
    const c = LL.getContext('2d', { willReadFrequently: true })
    const id = c.getImageData(0, 0, W, H_), d = id.data, iz = 1 / cam[2]
    for (let i = 3, q = 0; i < d.length; i += 4, q++) {
      if (!d[i]) continue
      const x = q % W, y = (q / W) | 0, wx = (x - W / 2) * iz + cam[0], wy = (y - H_ / 2) * iz + cam[1]
      const hx = (wx * 0.5) | 0, hy = (wy * 0.5) | 0, hh = Math.imul((hx * 73856093) ^ (hy * 19349663), 0x9e3779b1) >>> 0
      d[i] *= 0.74 + 0.26 * (0.5 + 0.5 * nz.n2(wx * 0.03, wy * 0.03)) - ((hh & 1023) < 70 ? 0.3 : 0)
    }
    c.putImageData(id, 0, 0)
    ctx.save(); ctx.filter = 'blur(2.5px)'; ctx.globalAlpha = 0.45; ctx.drawImage(LL, 0, 0); ctx.restore()
    ctx.save(); ctx.filter = 'blur(0.5px)'; ctx.drawImage(LL, 0, 0); ctx.restore()
  }

  // fold creases: folds = [[pos, vertical], ...] in world units
  BP.folds = (ctx, V, S, folds) => {
    ctx.save(); V.apply(ctx)
    folds.forEach(([pos, vert]) => {
      const g = vert ? ctx.createLinearGradient(pos - 40, 0, pos + 40, 0) : ctx.createLinearGradient(0, pos - 34, 0, pos + 34)
      g.addColorStop(0, 'rgba(0,10,30,0)'); g.addColorStop(0.48, 'rgba(0,10,30,0.22)'); g.addColorStop(0.5, 'rgba(190,210,240,0.22)'); g.addColorStop(0.56, 'rgba(190,210,240,0.06)'); g.addColorStop(1, 'rgba(190,210,240,0)')
      ctx.fillStyle = g
      if (vert) ctx.fillRect(pos - 40, V.y0, 80, V.y1 - V.y0); else ctx.fillRect(V.x0, pos - 34, V.x1 - V.x0, 68)
      const fk = pos + (vert ? 'v' : 'h')
      if (!XC.fibs[fk]) XC.fibs[fk] = XC.fib(vert, Math.ceil(vert ? S.y1 - S.y0 : S.x1 - S.x0))
      if (vert && V.x0 < pos + 20 && V.x1 > pos - 20) ctx.drawImage(XC.fibs[fk], pos - 12, S.y0)
      if (!vert && V.y0 < pos + 20 && V.y1 > pos - 20) ctx.drawImage(XC.fibs[fk], S.x0, pos - 12)
    })
    // crossing points wear most
    folds.filter((f) => f[1]).forEach(([x]) => folds.filter((f) => !f[1]).forEach(([y]) => {
      if (x + 70 < V.x0 || x - 70 > V.x1 || y + 70 < V.y0 || y - 70 > V.y1) return
      const g = ctx.createRadialGradient(x, y, 0, x, y, 64); g.addColorStop(0, 'rgba(200,220,245,0.28)'); g.addColorStop(1, 'rgba(200,220,245,0)')
      ctx.fillStyle = g; ctx.fillRect(x - 64, y - 64, 128, 128)
    }))
    ctx.restore()
  }

  // the plotter head over the current stroke (screen coords)
  BP.head = (ctx, x, y, W, H_) => {
    const gl = ctx.createRadialGradient(x, y, 0, x, y, 26); gl.addColorStop(0, 'rgba(230,245,255,0.8)'); gl.addColorStop(1, 'rgba(230,245,255,0)')
    ctx.fillStyle = gl; ctx.fillRect(x - 26, y - 26, 52, 52)
    ctx.strokeStyle = 'rgba(240,248,255,0.9)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.moveTo(x - 18, y); ctx.lineTo(x - 5, y); ctx.moveTo(x + 5, y); ctx.lineTo(x + 18, y); ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 5); ctx.moveTo(x, y + 5); ctx.lineTo(x, y + 18); ctx.stroke()
    ctx.setLineDash([3, 4]); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H_); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1
  }

  BP.finish = (ctx, W, H_, t) => {
    H.grain(ctx, W, H_, 0.04, 6 + (Math.floor(t * 12) % 4))
    H.vignette(ctx, W, H_, 0.3, '0,8,25')
  }

  window.BP = BP
})()
