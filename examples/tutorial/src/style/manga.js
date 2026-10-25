// Manga Page style helpers stub
;(function () {
  const noop = () => {}
  const makeCanvas = (w = 100, h = 100) => {
    const c = typeof document !== 'undefined' ? document.createElement('canvas') : { width: w, height: h }
    c.width = w
    c.height = h
    return c
  }

  window.MANGA = {
    TAU: Math.PI * 2,
    poly: noop,
    catmull: noop,
    brush: noop,
    bz: () => [],
    focusLines: noop,
    KANA: {},
    kanaStrokes: {},
    sfx: noop,
    bubble: noop,
    tone: (w, h) => makeCanvas(w || 100, h || 100),
    gradTone: (w, h) => makeCanvas(w || 100, h || 100),
    inkLoop: noop,
    rrPts: () => [],
    ellPts: () => [],
    pencilRough: noop,
    paper: (w, h) => makeCanvas(w || 1280, h || 720),
    robot: noop,
    narr: noop,
    mArrow: noop,
  }
})()
