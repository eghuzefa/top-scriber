import { useEffect, useMemo, useRef, useState } from 'react'
import { AudioBar } from '../components/AudioBar'
import { QuitOverlay } from '../components/QuitOverlay'
import { NoisePlayer } from '../lib/noise'
import { LENIENT, grossWpm, scoreTranscription, segmentAccuracies } from '../lib/scoring'
import { newId } from '../lib/storage'
import { TtsPlayer, ttsSupported, type TtsSnapshot } from '../lib/tts'
import type { TranscribeSample } from '../lib/types'
import { formatClock } from './TypingDrill'
import type { FinishPayload } from './payload'

interface TranscribeDrillProps {
  sample: TranscribeSample
  onFinish: (payload: FinishPayload) => void
  onQuit: () => void
}

const ACCENT_LABEL: Record<string, string> = {
  uk: 'British English',
  au: 'Australian English',
  in: 'Indian English',
}

/**
 * Listen-and-type. Also serves the accents & speed module (playback locked to
 * the scenario's preset) and endurance (long takes, scored in segments).
 */
export function TranscribeDrill({ sample, onFinish, onQuit }: TranscribeDrillProps) {
  const [snap, setSnap] = useState<TtsSnapshot>({ state: 'idle', chunkIndex: 0, chunkCount: 0 })
  const playerRef = useRef<TtsPlayer | null>(null)
  if (playerRef.current === null) playerRef.current = new TtsPlayer(setSnap)
  const noiseRef = useRef<NoisePlayer | null>(null)
  if (noiseRef.current === null) noiseRef.current = new NoisePlayer()

  const [typed, setTyped] = useState('')
  const [rate, setRate] = useState(sample.rate ?? 1)
  const [replays, setReplays] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [quitAsk, setQuitAsk] = useState(false)
  const finished = useRef(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const rateLocked = sample.skill === 'adapt'
  const noiseLevel = sample.noise ?? 'none'

  useEffect(() => {
    const player = playerRef.current
    const noise = noiseRef.current
    player?.load(sample.transcript, {
      rate: sample.rate ?? 1,
      voiceHint: sample.voiceHint ?? 'default',
    })
    return () => {
      player?.stop()
      noise?.dispose()
    }
  }, [sample])

  useEffect(() => {
    if (startedAt === null) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [startedAt])

  // Noise plays only while speech plays.
  useEffect(() => {
    if (noiseLevel === 'none') return
    const noise = noiseRef.current
    if (snap.state === 'playing') noise?.start(noiseLevel)
    else noise?.stop()
  }, [snap.state, noiseLevel])

  const start = () => {
    if (startedAt === null) setStartedAt(Date.now())
  }

  // Audio controls hand focus straight back to the typing area, so the next
  // keystroke always lands in the transcript — no click required.
  const refocus = () => inputRef.current?.focus()

  const onPlay = () => {
    start()
    void playerRef.current?.play()
    refocus()
  }
  const onPause = () => {
    playerRef.current?.pause()
    refocus()
  }
  const onRestart = () => {
    start()
    setReplays((r) => r + 1)
    playerRef.current?.restart()
    refocus()
  }
  const onRateChange = (r: number) => {
    setRate(r)
    playerRef.current?.setRate(r)
    refocus()
  }

  const finish = () => {
    if (finished.current || startedAt === null) return
    finished.current = true
    playerRef.current?.stop()
    noiseRef.current?.stop()
    const durationMs = Date.now() - startedAt
    const score = scoreTranscription(sample.transcript, typed, LENIENT)
    const quarters = sample.skill === 'endurance' ? segmentAccuracies(score, 4) : undefined
    onFinish({
      kind: 'diff',
      score,
      result: {
        id: newId('res'),
        at: Date.now(),
        skill: sample.skill,
        sampleId: sample.id,
        sampleTitle: sample.title,
        wpm: Math.round(grossWpm(typed.length, durationMs)),
        accuracy: score.accuracy,
        errors: score.subs + score.ins + score.dels,
        durationMs,
        detail: {
          subs: score.subs,
          ins: score.ins,
          dels: score.dels,
          replays,
          ...(quarters ? { quarters } : {}),
        },
      },
    })
  }

  const supported = ttsSupported()
  const voiceNote = useMemo(() => {
    if (!sample.voiceHint || sample.voiceHint === 'default') return undefined
    const label = ACCENT_LABEL[sample.voiceHint]
    if (snap.state !== 'idle' && playerRef.current && !playerRef.current.voiceMatchedHint) {
      return `${label} requested — using closest installed voice`
    }
    return label
  }, [sample.voiceHint, snap.state])

  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt)
  const words = typed.trim() === '' ? 0 : typed.trim().split(/\s+/).length

  return (
    <div className="drill">
      <div className="drill-top">
        <button className="btn btn-ghost" onClick={() => setQuitAsk(true)}>
          Exit
        </button>
        <div className="hud">
          <span>
            <strong>{formatClock(elapsed)}</strong> elapsed
          </span>
          <span>
            <strong>{words}</strong> words
          </span>
        </div>
      </div>
      <div className="drill-body">
        <div className="drill-title">
          {sample.title}
          <span className="chips">
            <span className="chip">{sample.domain}</span>
            <span className="chip">{sample.difficulty}</span>
            {sample.generated && <span className="chip chip-accent">AI</span>}
          </span>
        </div>

        {!supported && (
          <div className="notice notice-error">
            This browser has no speech synthesis, so listening drills can't play audio here.
            Chrome or Edge on desktop work best.
          </div>
        )}
        {snap.state === 'error' && <div className="notice notice-error">{snap.error}</div>}

        <AudioBar
          snap={snap}
          rate={rate}
          rateLocked={rateLocked}
          noise={noiseLevel}
          replays={replays}
          voiceNote={voiceNote}
          onPlay={onPlay}
          onPause={onPause}
          onRestart={onRestart}
          onRateChange={onRateChange}
        />

        <textarea
          ref={inputRef}
          className="transcribe-input"
          placeholder="Press play, then type what you hear…"
          value={typed}
          spellCheck={false}
          autoFocus
          onChange={(e) => {
            start()
            setTyped(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setQuitAsk(true)
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) finish()
          }}
        />

        <div className="result-actions">
          <button className="btn btn-primary" onClick={finish} disabled={startedAt === null}>
            Finish &amp; score
          </button>
          <span className="type-unfocused">Ctrl+Enter also finishes. Replays are counted, not punished.</span>
        </div>
      </div>
      {quitAsk && (
        <QuitOverlay
          onResume={() => {
            setQuitAsk(false)
            inputRef.current?.focus()
          }}
          onQuit={onQuit}
        />
      )}
    </div>
  )
}
