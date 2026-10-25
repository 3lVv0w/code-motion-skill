import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

export interface SocialConfig {
  youtube?: {
    title: string
    description: string
    tags?: string[]
    categoryId?: string
    privacyStatus?: "public" | "private" | "unlisted"
    publishAt?: string // ISO 8601 string
    selfDeclaredMadeForKids?: boolean
  }
  instagram?: {
    caption: string
    scheduledPublishTime?: string // ISO 8601 string
    thumbOffsetMs?: number
  }
  files?: {
    verticalVideo?: string
    landscapeVideo?: string
    thumbnail?: string
    thumbnailAlt?: string
  }
}

export function loadSocialEnv(tutorialRoot: string) {
  const envCandidates = [
    join(tutorialRoot, ".env"),
    join(tutorialRoot, "../../.env"),
  ]

  for (const envPath of envCandidates) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8")
      for (const line of content.split("\n")) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue
        const eqIdx = trimmed.indexOf("=")
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      }
    }
  }
}

export function getProjectPaths(tutorialRoot: string, id: string) {
  const cleanId = id.replace(/-vertical$/, "")
  const candidate1 = join(tutorialRoot, "../../projects", cleanId)
  const candidate2 = join(tutorialRoot, "../../projects", id)
  const candidate3 = join(tutorialRoot, "src/videos", cleanId)

  const projectDir = existsSync(candidate1)
    ? candidate1
    : existsSync(candidate2)
    ? candidate2
    : existsSync(candidate3)
    ? candidate3
    : null

  if (!projectDir) {
    throw new Error(`Project directory not found for id: "${id}". Checked projects/${cleanId}`)
  }

  const socialJsonPath = join(projectDir, "social.json")
  return {
    projectDir,
    socialJsonPath,
    cleanId,
  }
}

export function loadSocialConfig(tutorialRoot: string, id: string): { config: SocialConfig; projectDir: string } {
  const { projectDir, socialJsonPath, cleanId } = getProjectPaths(tutorialRoot, id)

  let config: SocialConfig = {}
  if (existsSync(socialJsonPath)) {
    try {
      config = JSON.parse(readFileSync(socialJsonPath, "utf8"))
    } catch (err) {
      console.warn(`[WARN] Failed to parse ${socialJsonPath}:`, err)
    }
  }

  // Provide defaults if missing
  if (!config.youtube) {
    config.youtube = {
      title: `${cleanId.replace(/-/g, " ")} #shorts`,
      description: `Exploring ${cleanId.replace(/-/g, " ")}.\n\n#shorts #code #animation`,
      tags: [cleanId, "shorts", "educational", "animation"],
      categoryId: "27",
      privacyStatus: "private",
    }
  }

  if (!config.instagram) {
    config.instagram = {
      caption: `Discover ${cleanId.replace(/-/g, " ")}! 🎬✨\n\n#reels #animation #creative`,
    }
  }

  return { config, projectDir }
}

export function parseArgs(rawArgs: string[]) {
  const flags: Record<string, string | boolean> = {}
  const positional: string[] = []

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i]
    if (arg.startsWith("--")) {
      const key = arg.slice(2)
      if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith("-")) {
        flags[key] = rawArgs[i + 1]
        i++
      } else {
        flags[key] = true
      }
    } else if (arg.startsWith("-")) {
      const key = arg.slice(1)
      if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith("-")) {
        flags[key] = rawArgs[i + 1]
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(arg)
    }
  }

  return { flags, positional }
}
