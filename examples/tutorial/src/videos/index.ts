// Plain browser scripts that publish window globals. Order matters: lib first.
import "../lib/harness.js"
import "../lib/sound.js"
import "../style/manga.js"
import "../style/blueprint.js"
import "../style/voxel.js"
import "./tutorial/visuals.js"
import "./tutorial/score.js"
import "./tutorial/vertical.js"
// User / Personal Projects (from root projects/)
import "../../../../projects/suno-mv/music-video.js"
import "../../../../projects/suno-mv/visuals.js"
import "../../../../projects/eternal-horizon/visuals.js"
import "../../../../projects/zipper-loop/visuals.js"
import "../../../../projects/zipper-loop/score.js"
import "../../../../projects/thailand-flood-loop/visuals.js"
import "../../../../projects/thailand-flood-loop/score.js"
import "../../../../projects/aiml-halloween-talk/score.js"
import "../../../../projects/aiml-halloween-talk/visuals.js"
import "../../../../projects/time-zones/visuals.js"
import "../../../../projects/time-zones/score.js"
import "./launch/logos.js"
import "./launch/visuals.js"
import "./launch/score.js"
import "./launch/vertical.js"

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
type OfflineResult = { inter: Float32Array; peak: number; sr: number }

declare global {
  interface Window {
    VIDEOS: Record<
      string,
      {
        draw: Draw
        duration: number
        score?: unknown
        width?: number
        height?: number
        fps?: number
        voice?: string
        music?: string
        images?: string[]
      }
    >
    SOUND: {
      renderOffline: (score: unknown, duration: number, sampleRate: number, opts: object) => Promise<OfflineResult>
    }
    LOGO: HTMLImageElement | null
    LOADED_IMAGES: Record<string, HTMLImageElement>
  }
}

export const VIDEOS = window.VIDEOS
