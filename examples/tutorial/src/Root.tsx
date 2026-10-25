import { Composition } from "remotion"
import { FPS, HEIGHT, SAMPLE_RATE, WIDTH } from "./config"
import { VideoCanvas } from "./VideoCanvas"
import { VIDEOS } from "./videos"

const renderScore = async (id: string) => {
  const video = VIDEOS[id]!
  if (!video.score) return { pcm: "", sampleRate: SAMPLE_RATE }
  const r = await window.SOUND.renderOffline(video.score, video.duration, SAMPLE_RATE, {})
  const norm = r.peak > 0.98 ? 0.98 / r.peak : 1
  const pcm = new Int16Array(r.inter.length)
  for (let i = 0; i < pcm.length; i++) pcm[i] = Math.max(-1, Math.min(1, r.inter[i]! * norm)) * 32767
  const bytes = new Uint8Array(pcm.buffer)
  let bin = ""
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { pcm: btoa(bin), sampleRate: r.sr }
}

export const Root = () => (
  <>
    {Object.entries(VIDEOS).map(([id, video]) => (
      <div key={id}>
        <Composition
          id={id}
          component={VideoCanvas}
          durationInFrames={Math.round(video.duration * (video.fps ?? FPS))}
          fps={video.fps ?? FPS}
          width={video.width ?? WIDTH}
          height={video.height ?? HEIGHT}
          defaultProps={{
            id,
            withAudio: Boolean(video.score),
            voiceAudio: video.voice,
            musicAudio: video.music,
          }}
        />
        {video.score ? (
          <Composition
            id={`${id}-audio`}
            component={() => null}
            durationInFrames={1}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{ pcm: "", sampleRate: SAMPLE_RATE }}
            calculateMetadata={async () => ({ props: await renderScore(id) })}
          />
        ) : null}
      </div>
    ))}
  </>
)
