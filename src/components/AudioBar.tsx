import type { TtsSnapshot } from '../lib/tts'
import type { NoiseLevel } from '../lib/types'

const RATES = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5]

interface AudioBarProps {
  snap: TtsSnapshot
  rate: number
  rateLocked: boolean
  noise: NoiseLevel
  replays: number
  voiceNote?: string
  onPlay: () => void
  onPause: () => void
  onRestart: () => void
  onRateChange: (rate: number) => void
}

export function AudioBar(props: AudioBarProps) {
  const { snap } = props
  const playing = snap.state === 'playing'
  const progress = snap.chunkCount > 0 ? snap.chunkIndex / snap.chunkCount : 0

  return (
    <div className="audio-bar">
      {playing ? (
        <button className="btn btn-secondary" onClick={props.onPause}>
          Pause
        </button>
      ) : (
        <button className="btn btn-primary" onClick={props.onPlay}>
          {snap.state === 'paused' ? 'Resume' : snap.state === 'ended' ? 'Play again' : 'Play'}
        </button>
      )}
      <button
        className="btn btn-ghost"
        onClick={props.onRestart}
        disabled={snap.state === 'idle'}
        title="Restart the audio from the beginning"
      >
        Replay
      </button>
      {props.rateLocked ? (
        <span className="chip chip-warn">speed locked · {props.rate}×</span>
      ) : (
        <label className="note">
          Speed{' '}
          <select
            className="rate-select"
            value={props.rate}
            onChange={(e) => props.onRateChange(Number(e.target.value))}
          >
            {RATES.map((r) => (
              <option key={r} value={r}>
                {r}×
              </option>
            ))}
          </select>
        </label>
      )}
      {props.noise !== 'none' && <span className="chip chip-warn">noise: {props.noise}</span>}
      <span className="spacer" />
      {props.replays > 0 && (
        <span className="note">
          {props.replays} replay{props.replays === 1 ? '' : 's'}
        </span>
      )}
      {props.voiceNote && <span className="note">{props.voiceNote}</span>}
      <div
        className="audio-progress"
        role="progressbar"
        aria-label="Audio progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    </div>
  )
}
