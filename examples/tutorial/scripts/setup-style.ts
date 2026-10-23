// bun run setup-style prompts/manga-page.md
// Pulls the third-party files this example needs out of the Manga Page style prompt, so they never
// have to be committed: src/lib/harness.js, src/lib/sound.js and src/style/manga.js.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const prompt = process.argv[2]
if (!prompt) throw new Error("Usage: bun run setup-style prompts/manga-page.md")

const root = join(import.meta.dir, "..")
const md = readFileSync(prompt, "utf8")
const blocks = [...md.matchAll(/```js\n([\s\S]*?)\n```/g)].map((m) => m[1]!)
if (blocks.length < 3) throw new Error("Expected the H library, the SOUND kit and the style source as ```js blocks")
const [harness, sound, style] = blocks as [string, string, string]

const END = "// ===== END EXPLAINER HELPERS ====="
const start = style.indexOf("{\n") + 2
const end = style.indexOf(END)
if (end < 0) throw new Error(`Style source has no "${END}" marker: is this the Manga Page prompt?`)
const helpers = style.slice(start, end)

// every top-level helper the reference declares, minus its private caches
const names = [...helpers.matchAll(/^ {2}(?:function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=)/gm)]
  .map((m) => m[1] ?? m[2] ?? m[3]!)
  .filter((n, i, all) => all.indexOf(n) === i && !["PAPER", "TONES", "GTONES"].includes(n))

const write = (path: string, text: string) => {
  mkdirSync(dirname(join(root, path)), { recursive: true })
  writeFileSync(join(root, path), text)
  console.log(`wrote ${path}`)
}
write("src/lib/harness.js", harness + "\n")
write("src/lib/sound.js", sound + "\n")
write(
  "src/style/manga.js",
  `// Manga Page helpers, taken unchanged from the Futurepedia AI Style Atlas reference.\n;(function () {\n${helpers}\n  window.MANGA = { ${names.join(", ")} };\n})();\n`
)
