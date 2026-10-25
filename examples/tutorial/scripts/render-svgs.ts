import { bundle } from "@remotion/bundler"
import { openBrowser } from "@remotion/renderer"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const dir = join(import.meta.dir, "../public/images/logos")
const svgs = [
  { name: "claude", fill: "#D97706" },
  { name: "codex", src: "openai.svg", fill: "#000000" },
  { name: "cursor", fill: "#000000" },
  { name: "git", fill: "#F05032" }
]

const browser = await openBrowser("chrome")
const page = await browser.newPage()
await page.setViewport({ width: 256, height: 256, deviceScaleFactor: 2 })

for (const item of svgs) {
  const srcFile = item.src || `${item.name}.svg`
  let svg = readFileSync(join(dir, srcFile), "utf8")
  if (!svg.includes("fill=") || svg.includes('fill="#000000"')) {
    svg = svg.replace(/fill="[^"]*"/, "").replace("<svg ", `<svg fill="${item.fill}" `)
  }
  const html = `<!DOCTYPE html><html><body style="margin:0;background:transparent;display:flex;justify-content:center;align-items:center;width:256px;height:256px;"><div style="width:200px;height:200px;">${svg.replace("<svg ", '<svg style="width:100%;height:100%;" ')}</div></body></html>`
  await page.setContent(html)
  const buf = await page.screenshot({ omitBackground: true })
  writeFileSync(join(dir, `${item.name}.png`), buf)
  console.log("Rendered", item.name + ".png")
}

await browser.close()
