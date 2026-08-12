import { useCallback, useEffect, useRef, useState } from 'react'
import { QuitOverlay } from '../components/QuitOverlay'
import { charDiff, termMatches } from '../lib/scoring'
import { newId } from '../lib/storage'
import { TtsPlayer, ttsSupported, type TtsSnapshot } from '../lib/tts'
import type { VocabSample } from '../lib/types'
import type { FinishPayload, VocabRound } from './payload'

interface VocabDrillProps {
  sample: VocabSample
  onFinish: (payload: FinishPayload) => void
  onQuit: () => void
}

type Phase = 'answer' | 'good' | 'bad'

/**
 * Vocabulary dictation: each term is spoken and clued; spell it before the
 * clock runs out. Misses show the correct spelling immediately.
 */
export function VocabDrill({ sample, onFinish, onQuit }: VocabDrillProps) {
  const totalMs = sample.secondsPerTerm * 1000
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('answer')
  const [input, setInput] = useState('')
  const [remaining, setRemaining] = useState(totalMs)
  const [quitAsk, setQuitAsk] = useState(false)
  const [, setSnap] = useState<TtsSnapshot>({ state: 'idle', chunkIndex: 0, chunkCount: 0 })

  const playerRef = useRef<TtsPlayer | null>(null)
  if (playerRef.current === null) playerRef.current = new TtsPlayer(setSnap)
  const rounds = useRef<VocabRound[]>([])
  const evaluated = useRef(false)
  // Set when a miss is revealed: the Enter press that submitted the answer
  // must not also activate the freshly-focused "Next term" button.
  const revealShownAt = useRef(0)
  const termStart = useRef(Date.now())
  const pauseStart = useRef<number | null>(null)
  const drillStart = useRef(Date.now())
  const inputValue = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)

  const term = sample.terms[index]
  const supported = ttsSupported()

  const speakTerm = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    player.load(sample.terms[index].term, { rate: 0.92, voiceHint: 'default' })
    void player.play()
  }, [index, sample])

  // New term: reset state and speak it.
  useEffect(() => {
    evaluated.current = false
    termStart.current = Date.now()
    inputValue.current = ''
    setInput('')
    setPhase('answer')
    setRemaining(totalMs)
    if (ttsSupported()) speakTerm()
    inputRef.current?.focus()
    return () => playerRef.current?.stop()
  }, [index, totalMs, speakTerm])

  const finishAll = useCallback(() => {
    const all = rounds.current
    const correct = all.filter((r) => r.correct).length
    const missed = all.filter((r) => !r.correct).map((r) => r.term)
    onFinish({
      kind: 'vocab',
      rounds: all,
      result: {
        id: newId('res'),
        at: Date.now(),
        skill: 'vocab',
        sampleId: sample.id,
        sampleTitle: sample.title,
        wpm: 0,
        accuracy: all.length === 0 ? 0 : correct / all.length,
        errors: all.length - correct,
        durationMs: Date.now() - drillStart.current,
        detail: { missed },
      },
    })
  }, [onFinish, sample])

  const advance = useCallback(() => {
    if (index + 1 >= sample.terms.length) finishAll()
    else setIndex((i) => i + 1)
  }, [index, sample.terms.length, finishAll])

  const advanceFromReveal = useCallback(() => {
    if (Date.now() - revealShownAt.current < 250) return
    advance()
  }, [advance])

  const evaluate = useCallback(
    (typed: string) => {
      if (evaluated.current) return
      evaluated.current = true
      playerRef.current?.stop()
      const ms = Math.min(totalMs, Date.now() - termStart.current)
      const correct = termMatches(term.term, typed)
      if (!correct) revealShownAt.current = Date.now()
      rounds.current = [
        ...rounds.current,
        { term: term.term, clue: term.clue, typed, correct, ms },
      ]
      setPhase(correct ? 'good' : 'bad')
    },
    [term, totalMs],
  )

  // Countdown — paused while the quit dialog is open.
  useEffect(() => {
    if (phase !== 'answer' || quitAsk) return
    const t = window.setInterval(() => {
      const left = totalMs - (Date.now() - termStart.current)
      setRemaining(Math.max(0, left))
      if (left <= 0) evaluate(inputValue.current)
    }, 100)
    return () => window.clearInterval(t)
  }, [phase, quitAsk, totalMs, evaluate])

  // Brief green flash on a correct answer, then next term.
  useEffect(() => {
    if (phase !== 'good') return
    const t = window.setTimeout(advance, 650)
    return () => window.clearTimeout(t)
  }, [phase, advance])

  const openQuit = () => {
    pauseStart.current = Date.now()
    setQuitAsk(true)
  }
  const resumeQuit = () => {
    if (pauseStart.current !== null) {
      termStart.current += Date.now() - pauseStart.current
      pauseStart.current = null
    }
    setQuitAsk(false)
    inputRef.current?.focus()
  }

  const fraction = remaining / totalMs

  return (
    <div className="drill">
      <div className="drill-top">
        <button className="btn btn-ghost" onClick={openQuit}>
          Exit
        </button>
        <div className="hud">
          <span>
            term <strong>{index + 1}</strong> of {sample.terms.length}
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

        {!supported && (
          <div className="notice notice-warn">
            No speech synthesis in this browser — spelling from the definition alone.
          </div>
        )}

        <div className="vocab-stage">
          <p className="vocab-clue">{term.clue}</p>
          {supported && (
            <button className="btn btn-secondary" onClick={speakTerm}>
              Hear it again
            </button>
          )}

          {phase !== 'bad' ? (
            <>
              <input
                ref={inputRef}
                className={`vocab-input${phase === 'good' ? ' flash-good' : ''}`}
                value={input}
                placeholder="type the term"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Type the term you hear"
                disabled={phase !== 'answer'}
                onChange={(e) => {
                  setInput(e.target.value)
                  inputValue.current = e.target.value
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') openQuit()
                  if (e.key === 'Enter' && phase === 'answer') {
                    e.preventDefault()
                    evaluate(inputValue.current)
                  }
                }}
              />
              <div
                className={`timebar${fraction < 0.3 ? ' low' : ''}`}
                role="timer"
                aria-label={`${Math.ceil(remaining / 1000)} seconds left`}
              >
                <div style={{ width: `${fraction * 100}%` }} />
              </div>
              <div className="vocab-count">{Math.ceil(remaining / 1000)}s</div>
            </>
          ) : (
            <div className="vocab-reveal">
              {input.trim() !== '' ? (
                <div className="typed">
                  {charDiff(term.term, input.trim()).map((c, i) => (
                    <span key={i} className={c.ok ? '' : 'off'}>
                      {c.ch}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="typed" style={{ color: 'var(--ink-3)' }}>
                  (time ran out)
                </div>
              )}
              <div className="correct-spelling">{term.term}</div>
              <button className="btn btn-primary" onClick={advanceFromReveal} autoFocus>
                {index + 1 >= sample.terms.length ? 'See results' : 'Next term'}
              </button>
            </div>
          )}
        </div>
      </div>
      {quitAsk && <QuitOverlay onResume={resumeQuit} onQuit={onQuit} />}
    </div>
  )
}
