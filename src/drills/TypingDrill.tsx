import { useEffect, useRef, useState } from 'react'
import { QuitOverlay } from '../components/QuitOverlay'
import { grossWpm, typingAccuracy } from '../lib/scoring'
import { newId } from '../lib/storage'
import type { TypingSample } from '../lib/types'
import type { FinishPayload } from './payload'

interface TypingDrillProps {
  sample: TypingSample
  onFinish: (payload: FinishPayload) => void
  onQuit: () => void
}

/**
 * Copy-typing drill: the passage is on screen, every keystroke is checked
 * immediately. Timer runs from the first keystroke to the last character.
 */
export function TypingDrill({ sample, onFinish, onQuit }: TypingDrillProps) {
  const text = sample.text
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [quitAsk, setQuitAsk] = useState(false)
  const [focused, setFocused] = useState(true)
  const keypresses = useRef(0)
  const errorKeypresses = useRef(0)
  const finished = useRef(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    boxRef.current?.focus()
  }, [])

  useEffect(() => {
    if (startedAt === null || finished.current) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [startedAt])

  useEffect(() => {
    if (finished.current || startedAt === null || typed.length < text.length) return
    finished.current = true
    const durationMs = Date.now() - startedAt
    const wrongAt = Array.from(text, (ch, i) => typed[i] !== ch)
    const uncorrected = wrongAt.filter(Boolean).length
    onFinish({
      kind: 'typing',
      text,
      wrongAt,
      result: {
        id: newId('res'),
        at: Date.now(),
        skill: 'typing',
        sampleId: sample.id,
        sampleTitle: sample.title,
        wpm: Math.round(grossWpm(text.length, durationMs)),
        accuracy: typingAccuracy(keypresses.current, errorKeypresses.current),
        errors: uncorrected,
        durationMs,
      },
    })
  }, [typed, text, startedAt, sample, onFinish])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (quitAsk || finished.current) return
    if (e.key === 'Escape') {
      setQuitAsk(true)
      return
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      setTyped((t) => t.slice(0, -1))
      return
    }
    if (e.key.length !== 1) return
    e.preventDefault()
    if (typed.length >= text.length) return
    if (startedAt === null) setStartedAt(Date.now())
    keypresses.current += 1
    if (e.key !== text[typed.length]) errorKeypresses.current += 1
    setTyped((t) => t + e.key)
  }

  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt)
  const liveWpm = startedAt === null ? 0 : Math.round(grossWpm(typed.length, Date.now() - startedAt))
  const liveErrors = countCurrentErrors(text, typed)

  return (
    <div className="drill">
      <div className="drill-top">
        <button className="btn btn-ghost" onClick={() => setQuitAsk(true)}>
          Exit
        </button>
        <div className="hud" aria-live="off">
          <span>
            <strong>{formatClock(elapsed)}</strong> elapsed
          </span>
          <span>
            <strong>{liveWpm}</strong> wpm
          </span>
          <span>
            <strong>{liveErrors}</strong> to fix
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
        <div
          ref={boxRef}
          className="type-target"
          tabIndex={0}
          role="textbox"
          aria-label="Type the passage shown"
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {Array.from(text, (ch, i) => {
            const cls =
              i < typed.length ? (typed[i] === ch ? 'ok' : 'bad') : i === typed.length ? 'pending caret' : 'pending'
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            )
          })}
        </div>
        {!focused && <div className="type-unfocused">Click the passage to keep typing.</div>}
        {startedAt === null && focused && (
          <div className="type-unfocused">The timer starts with your first keystroke.</div>
        )}
      </div>
      {quitAsk && <QuitOverlay onResume={() => {
        setQuitAsk(false)
        boxRef.current?.focus()
      }} onQuit={onQuit} />}
    </div>
  )
}

function countCurrentErrors(text: string, typed: string): number {
  let n = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== text[i]) n++
  }
  return n
}

export function formatClock(ms: number): string {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
