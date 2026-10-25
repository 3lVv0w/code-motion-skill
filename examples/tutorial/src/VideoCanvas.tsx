import { useEffect, useRef, useState } from "react"
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { FONT_SAMPLE, FONT_SPECS, LOGO } from "./config"
import { VIDEOS } from "./videos"

const FONT_CSS = staticFile("fonts/fonts.css")

const loadedImages: Record<string, HTMLImageElement> = {}
if (typeof window !== "undefined") {
  window.LOADED_IMAGES = loadedImages
}

const loadAssets = async (id: string) => {
  if (!document.querySelector(`link[href="${FONT_CSS}"]`)) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = FONT_CSS
    document.head.appendChild(link)
    await new Promise((resolve) => link.addEventListener("load", resolve, { once: true }))
  }
  await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec, FONT_SAMPLE)))
  if (LOGO) {
    const logo = new Image()
    logo.src = staticFile(LOGO)
    await logo.decode().catch(() => null)
    window.LOGO = logo
  }

  // Preload any custom images specified by the video definition
  const video = VIDEOS[id]
  if (video?.images && Array.isArray(video.images)) {
    await Promise.all(
      video.images.map(async (src) => {
        if (!loadedImages[src]) {
          const img = new Image()
          img.src = staticFile(src)
          await img.decode().catch((err) => console.warn(`Failed to decode image ${src}:`, err))
          loadedImages[src] = img
        }
      })
    )
  }
}

export const VideoCanvas = ({
  id,
  withAudio,
  voiceAudio,
  musicAudio,
}: {
  id: string
  withAudio: boolean
  voiceAudio?: string
  musicAudio?: string
}) => {
  const frame = useCurrentFrame()
  const { width, height, fps } = useVideoConfig()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [handle] = useState(() => delayRender("Loading fonts, logo, and assets"))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadAssets(id).then(() => {
      setReady(true)
      continueRender(handle)
    })
  }, [id, handle])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ready || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    VIDEOS[id]!.draw(ctx, width, height, frame / fps)
  }, [id, frame, fps, ready, width, height])

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={width} height={height} />
      {withAudio ? <Audio src={staticFile(`${id}.wav`)} /> : null}
      {voiceAudio ? <Audio src={staticFile(voiceAudio)} /> : null}
      {musicAudio ? <Audio src={staticFile(musicAudio)} /> : null}
    </AbsoluteFill>
  )
}
