import { useEffect, useRef, useState } from "react"
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { FONT_SAMPLE, FONT_SPECS, LOGO } from "./config"
import { VIDEOS } from "./videos"

const FONT_CSS = staticFile("fonts/fonts.css")

const loadAssets = async () => {
  if (!document.querySelector(`link[href="${FONT_CSS}"]`)) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = FONT_CSS
    document.head.appendChild(link)
    await new Promise((resolve) => link.addEventListener("load", resolve, { once: true }))
  }
  await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec, FONT_SAMPLE)))
  if (!LOGO) return
  const logo = new Image()
  logo.src = staticFile(LOGO)
  await logo.decode()
  window.LOGO = logo
}

export const VideoCanvas = ({ id, withAudio, voiceAudio }: { id: string; withAudio: boolean; voiceAudio?: string }) => {
  const frame = useCurrentFrame()
  const { width, height, fps } = useVideoConfig()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [handle] = useState(() => delayRender("Loading fonts and logo"))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadAssets().then(() => {
      setReady(true)
      continueRender(handle)
    })
  }, [handle])

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
    </AbsoluteFill>
  )
}
