import { useRef, useState } from 'react'
import { QuitOverlay } from '../components/QuitOverlay'
import { HOUSE_STYLE } from '../data/samples/format'
import { STRICT, grossWpm, scoreTranscription } from '../lib/scoring'
import { newId } from '../lib/storage'
import type { FormatSample } from '../lib/types'
import { formatClock } from './TypingDrill'
import type { FinishPayload } from './payload'
import { useEffect } from 'react'

interface FormatDrillProps {
  sample: FormatSample
  onFinish: (payload: FinishPayload) => void
  onQuit: () => void
}

/**
 * Formatting discipline: rewrite the raw feed into house style. Scored
 * strictly — capitalization and punctuation count on every word.
 */
export function FormatDrill({ sample, onFinish, onQuit }: FormatDrillProps) {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [quitAsk, setQuitAsk] = useState(false)
  const finished = useRef(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (startedAt === null) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [startedAt])

  const finish = () => {
    if (finished.current || startedAt === null) return
    finished.current = true
    const durationMs = Date.now() - startedAt
    const score = scoreTranscription(sample.formatted, typed, STRICT)
    onFinish({
      kind: 'diff',
      score,
      result: {
        id: newId('res'),
        at: Date.now(),
        skill: 'format',
        sampleId: sample.id,
        sampleTitle: sample.title,
        wpm: Math.round(grossWpm(typed.length, durationMs)),
        accuracy: score.accuracy,
        errors: score.subs + score.ins + score.dels,
        durationMs,
        detail: { subs: score.subs, ins: score.ins, dels: score.dels },
      },
    })
  }

  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt)

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
        </div>
      </div>
      <div className="drill-body">
        <div className="drill-title">
          {sample.title}
          <span className="chips">
            <span className="chip">{sample.domain}</span>
            <span className="chip">{sample.difficulty}</span>
          </span>
        </div>

        <div className="format-pane">
          <div>
            <div className="spark-cap" style={{ marginBottom: 6 }}>
              Raw feed
            </div>
            <div className="raw-feed">{sample.raw}</div>
          </div>
          <div className="style-card">
            <h3>{sample.rules ? 'Chart style' : 'House style'}</h3>
            <ol>
              {(sample.rules ?? HOUSE_STYLE).map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ol>
          </div>
        </div>

        <textarea
          ref={inputRef}
          className="transcribe-input"
          placeholder={
            sample.rules
              ? 'Rewrite the dictation as a chart note — one section per line…'
              : 'Rewrite the raw feed in house style — one turn per line…'
          }
          value={typed}
          spellCheck={false}
          autoFocus
          onChange={(e) => {
            if (startedAt === null) setStartedAt(Date.now())
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
          <span className="type-unfocused">
            Scored word by word, strictly — line breaks are not scored.
          </span>
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
