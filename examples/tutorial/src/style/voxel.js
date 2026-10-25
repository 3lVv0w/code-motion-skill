// Voxel Diorama style helpers from Futurepedia AI Style Atlas (Dimensional family)
;(function () {
  const ELEV = Math.PI / 6
  let ca = Math.cos(0.62), sa = Math.sin(0.62)
  const sP = Math.sin(ELEV), cP = Math.cos(ELEV)
  const setYaw = (y) => { ca = Math.cos(y); sa = Math.sin(y) }
  const makeProj = (cx, cy, s) => (x, y, z) => [
    cx + (x * ca - y * sa) * s,
    cy + (x * sa + y * ca) * sP * s - z * cP * s
  ]
  const depthOf = (x, y, z) => (x * sa + y * ca) * cP + z * sP
  const K = (x, y, z) => ((z + 32) * 256 + (y + 64)) * 256 + (x + 64)

  const FACES = [
    { n: [0, 0, 1], o: [0, 0, 1], t1: [1, 0, 0], t2: [0, 1, 0], light: 1.0, tint: [1.0, 0.98, 0.93] },
    { n: [0, 1, 0], o: [0, 1, 0], t1: [1, 0, 0], t2: [0, 0, 1], light: 0.8, tint: [0.97, 0.95, 1.0] },
    { n: [1, 0, 0], o: [1, 0, 0], t1: [0, 1, 0], t2: [0, 0, 1], light: 0.64, tint: [0.92, 0.92, 1.04] },
  ]

  let VX_TEXT = null, VX_SH = null, VX_GR = null

  function vxRaster(str) {
    if (!VX_TEXT) VX_TEXT = {}
    if (!VX_TEXT[str]) {
      const c = H.layer(360, 16), x = c.getContext('2d', { willReadFrequently: true })
      x.font = '400 8px "Silkscreen", monospace'
      x.textBaseline = 'top'
      x.fillStyle = '#000'
      x.fillText(str, 0, 1)
      const d = x.getImageData(0, 0, 360, 16).data, px = []
      let maxX = 0
      for (let yy = 0; yy < 16; yy++) for (let xx = 0; xx < 360; xx++) {
        if (d[(yy * 360 + xx) * 4 + 3] > 110) { px.push([xx, yy]); maxX = Math.max(maxX, xx) }
      }
      VX_TEXT[str] = { px, w: maxX + 1 }
    }
    return VX_TEXT[str]
  }

  function vxBlockTag(ctx, x, y, text, o = {}) {
    ctx.save()
    ctx.font = o.font || '400 24px "Silkscreen", monospace'
    const fsz = parseInt((ctx.font.match(/(\d+)px/) || [0, 22])[1])
    const w = Math.ceil(ctx.measureText(text).width) + fsz * 1.3
    const h = o.h || Math.round(fsz * 1.7)
    const k = o.k ?? 1
    const d = o.d ?? 5
    ctx.translate(Math.round(x), Math.round(y))
    ctx.scale(k, k)
    const bg = H.hex(o.bg || '#fff4e2')

    // Right depth side
    ctx.fillStyle = H.rgba(bg.map((c) => c * 0.62))
    ctx.beginPath()
    ctx.moveTo(w / 2, -h / 2); ctx.lineTo(w / 2 + d, -h / 2 + d)
    ctx.lineTo(w / 2 + d, h / 2 + d); ctx.lineTo(w / 2, h / 2)
    ctx.fill()

    // Bottom depth side
    ctx.fillStyle = H.rgba(bg.map((c) => c * 0.78))
    ctx.beginPath()
    ctx.moveTo(-w / 2, h / 2); ctx.lineTo(w / 2, h / 2)
    ctx.lineTo(w / 2 + d, h / 2 + d); ctx.lineTo(-w / 2 + d, h / 2 + d)
    ctx.fill()

    // Soft drop shadow
    ctx.save()
    ctx.shadowColor = `rgba(90,50,30,${0.35 * (ctx.globalAlpha ?? 1)})`
    ctx.shadowBlur = 12 * k; ctx.shadowOffsetY = 6 * k; ctx.shadowOffsetX = 2 * k
    ctx.fillStyle = H.rgba(bg); ctx.fillRect(-w / 2, -h / 2, w, h)
    ctx.restore()

    // Front face
    ctx.fillStyle = H.rgba(bg); ctx.fillRect(-w / 2, -h / 2, w, h)
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillRect(-w / 2, -h / 2, w, 2); ctx.fillRect(-w / 2, -h / 2, 2, h)

    ctx.fillStyle = o.col || '#74432d'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(text, 0, 1)
    ctx.restore()
  }

  function vxPixelText(ctx, str, cx, cy, ts, colTop, colBot, align = 'center', prog = 1) {
    const T = vxRaster(str)
    const ox = align === 'center' ? cx - (T.w * ts) / 2 : cx
    const oy = cy - 5 * ts
    const set = new Set(T.px.map((p) => p[0] + ',' + p[1]))
    const dx = ts * 0.42
    const vis = T.px.filter((p) => p[0] <= T.w * prog)

    for (const [x, y] of vis) {
      const sx = ox + x * ts, sy = oy + y * ts
      const c = H.mix(colTop, colBot, y / 9)
      if (!set.has(x + 1 + ',' + y)) {
        ctx.fillStyle = H.rgba(c.map((v) => v * 0.62))
        ctx.beginPath(); ctx.moveTo(sx + ts, sy); ctx.lineTo(sx + ts + dx, sy + dx)
        ctx.lineTo(sx + ts + dx, sy + ts + dx); ctx.lineTo(sx + ts, sy + ts); ctx.fill()
      }
      if (!set.has(x + ',' + (y + 1))) {
        ctx.fillStyle = H.rgba(c.map((v) => v * 0.78))
        ctx.beginPath(); ctx.moveTo(sx, sy + ts); ctx.lineTo(sx + ts, sy + ts)
        ctx.lineTo(sx + ts + dx, sy + ts + dx); ctx.lineTo(sx + dx, sy + ts + dx); ctx.fill()
      }
    }
    for (const [x, y] of vis) {
      const sx = ox + x * ts, sy = oy + y * ts
      const c = H.mix(colTop, colBot, y / 9)
      ctx.fillStyle = H.rgba(c)
      ctx.fillRect(sx - 0.3, sy - 0.3, ts + 0.6, ts + 0.6)
      if (!set.has(x + ',' + (y - 1))) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fillRect(sx, sy, ts, Math.max(1, ts * 0.14))
      }
    }
    return T.w * ts
  }

  function drawVoxels(ctx, V0, P, s, opts = {}) {
    const t = opts.t ?? 99
    let V = V0
    const falling = []
    const DROP = 0.32
    if (opts.at) {
      V = new Map()
      for (const [k, v] of V0) {
        const a = opts.at(v)
        if (t >= a + DROP) V.set(k, v)
        else if (t > a) {
          const q = (t - a) / DROP
          falling.push({ ...v, z: v.z + (1 - H.ease.out(q)) * 7, fall: true })
        }
      }
    }
    const has = (x, y, z) => V.has(K(x, y, z))
    const L = [-0.42, -0.62, 0.66]
    const list = [...V.values(), ...falling]
    list.sort((a, b) => depthOf(a.x, a.y, a.z) - depthOf(b.x, b.y, b.z))
    const glows = []

    for (let v of list) {
      const v0 = v
      if (opts.cull) {
        const c = P(v.x + 0.5, v.y + 0.5, v.z + 0.5)
        if (c[0] < -s * 2 || c[0] > opts.cull[0] + s * 2 || c[1] < -s * 2 || c[1] > opts.cull[1] + s * 2) continue
      }
      for (const F of FACES) {
        v = v0
        const fx = v.x + F.n[0], fy = v.y + F.n[1], fz = v.z + F.n[2]
        if (!v.fall && has(fx, fy, fz)) continue
        const O = [v.x + F.o[0], v.y + F.o[1], v.z + F.o[2]]
        const p0 = P(...O)
        const p1 = P(O[0] + F.t1[0], O[1] + F.t1[1], O[2] + F.t1[2])
        const p3 = P(O[0] + F.t2[0], O[1] + F.t2[1], O[2] + F.t2[2])
        const e1 = [p1[0] - p0[0], p1[1] - p0[1]]
        const e2 = [p3[0] - p0[0], p3[1] - p0[1]]

        if (v.e) {
          const c = H.mix(v.c, [255, 255, 255], F === FACES[0] ? 0.25 : 0.05)
          const st = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
          ctx.fillStyle = st; ctx.strokeStyle = st; ctx.lineWidth = 0.6
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0] + e1[0], p0[1] + e1[1])
          ctx.lineTo(p0[0] + e1[0] + e2[0], p0[1] + e1[1] + e2[1]); ctx.lineTo(p0[0] + e2[0], p0[1] + e2[1])
          ctx.closePath(); ctx.fill(); ctx.stroke()
          if (F === FACES[0]) glows.push([p0[0] + (e1[0] + e2[0]) / 2, p0[1] + (e1[1] + e2[1]) / 2, v.c])
          continue
        }

        let base = v.c.map((ch, i) => ch * F.light * F.tint[i])
        if (opts.depthDark && v.z < 8) {
          base = H.mix(base, [70, 50, 70], H.clamp((8 - v.z) / 16) * 0.45)
        }
        const st = `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`
        ctx.fillStyle = st; ctx.strokeStyle = st; ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0] + e1[0], p0[1] + e1[1])
        ctx.lineTo(p0[0] + e1[0] + e2[0], p0[1] + e1[1] + e2[1]); ctx.lineTo(p0[0] + e2[0], p0[1] + e2[1])
        ctx.closePath(); ctx.fill(); ctx.stroke()
      }
    }
    return glows
  }

  window.VOXEL = {
    ELEV,
    setYaw,
    makeProj,
    depthOf,
    K,
    FACES,
    drawVoxels,
    vxBlockTag,
    vxPixelText,
    vxRaster
  }
})()
