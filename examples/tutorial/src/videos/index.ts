// Plain browser scripts that publish window globals. Order matters: lib first.
import "../lib/harness.js"
import "../lib/sound.js"
import "../style/manga.js"
import "./tutorial/visuals.js"
import "./tutorial/score.js"
import "./tutorial/vertical.js"

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
type OfflineResult = { inter: Float32Array; peak: number; sr: number }

declare global {
  interface Window {
    VIDEOS: Record<string, { draw: Draw; duration: number; score: unknown; width?: number; height?: number }>
    SOUND: {
      renderOffline: (score: unknown, duration: number, sampleRate: number, opts: object) => Promise<OfflineResult>
    }
    LOGO: HTMLImageElement | null
  }
}

export const VIDEOS = window.VIDEOS
