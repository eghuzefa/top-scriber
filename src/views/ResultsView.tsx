import { useMemo } from 'react'
import { DiffView } from '../components/DiffView'
import { samplesForSkill } from '../data/samples'
import { SKILL_BY_ID } from '../data/skills'
import type { FinishPayload } from '../drills/payload'
import { formatClock } from '../drills/TypingDrill'
import { navigate, routeHash } from '../lib/router'
import { charDiff } from '../lib/scoring'
import { loadGenerated } from '../lib/storage'
import type { Sample } from '../lib/types'

interface ResultsViewProps {
  sample: Sample
  payload: FinishPayload
  saved: boolean
  onRetry: () => void
}

const pct = (v: number) => `${Math.round(v * 100)}%`

export function ResultsView({ sample, payload, saved, onRetry }: ResultsViewProps) {
  const r = payload.result

  const next = useMemo(() => {
    const list: Sample[] = [
      ...samplesForSkill(sample.skill),
      ...loadGenerated().filter((g) => g.skill === sample.skill),
    ]
    const idx = list.findIndex((s) => s.id === sample.id)
    const candidate = idx === -1 ? list[0] : list[(idx + 1) % list.length]
    return candidate && candidate.id !== sample.id ? candidate : null
  }, [sample])

  const quarters = payload.kind === 'diff' ? payload.result.detail?.quarters : undefined

  return (
    <div className="drill">
      <div className="drill-top">
        <a className="btn btn-ghost" href={routeHash({ name: 'skill', skillId: sample.skill })}>
          Back to {SKILL_BY_ID[sample.skill].short}
        </a>
        <span />
      </div>
      <div className="drill-body results">
        <div className="drill-title">Drill complete — {sample.title}</div>

        {!saved && (
          <div className="notice notice-warn">
            This result couldn't be saved to browser storage, so it won't appear in Progress.
          </div>
        )}

        <div className="stat-row">
          {payload.kind === 'vocab' ? (
            <>
              <Stat label="Correct" value={`${payload.rounds.filter((x) => x.correct).length}/${payload.rounds.length}`} />
              <Stat label="Accuracy" value={pct(r.accuracy)} />
              <Stat
                label="Avg per term"
                value={`${(payload.rounds.reduce((a, x) => a + x.ms, 0) / payload.rounds.length / 1000).toFixed(1)}s`}
              />
              <Stat label="Time" value={formatClock(r.durationMs)} />
            </>
          ) : (
            <>
              <Stat label="Accuracy" value={pct(r.accuracy)} />
              <Stat
                label={payload.kind === 'typing' ? 'WPM' : 'Effective WPM'}
                value={String(r.wpm)}
                sub={payload.kind === 'typing' ? 'gross, 5 chars per word' : 'includes listening time'}
              />
              <Stat
                label="Errors"
                value={String(r.errors)}
                sub={
                  payload.kind === 'diff'
                    ? `${r.detail?.subs ?? 0} wrong · ${r.detail?.dels ?? 0} missed · ${r.detail?.ins ?? 0} extra`
                    : 'left uncorrected'
                }
              />
              <Stat
                label="Time"
                value={formatClock(r.durationMs)}
                sub={
                  r.detail?.replays !== undefined && r.detail.replays > 0
                    ? `${r.detail.replays} replay${r.detail.replays === 1 ? '' : 's'}`
                    : undefined
                }
              />
            </>
          )}
        </div>

        {quarters && quarters.length > 0 && (
          <div className="card">
            <div className="spark-cap" style={{ marginBottom: 8 }}>
              Accuracy by quarter — did focus hold to the end?
            </div>
            <div className="segments">
              {quarters.map((q, i) => (
                <div key={i} className={`segment${q < 0.85 ? ' weak' : ''}`}>
                  <div className="bar">
                    <div style={{ height: `${Math.max(6, Math.round(q * 100))}%` }} />
                  </div>
                  <div>{pct(q)}</div>
                  <div style={{ color: 'var(--ink-3)' }}>Q{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {payload.kind === 'diff' && <DiffView score={payload.score} />}

        {payload.kind === 'typing' && (
          <div>
            <div className="spark-cap" style={{ marginBottom: 6 }}>
              Uncorrected characters are highlighted
            </div>
            <div className="type-target" style={{ cursor: 'default', userSelect: 'text' }}>
              {Array.from(payload.text, (ch, i) => (
                <span key={i} className={payload.wrongAt[i] ? 'bad' : 'ok'}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}

        {payload.kind === 'vocab' && payload.rounds.some((x) => !x.correct) && (
          <div className="card">
            <div className="spark-cap" style={{ marginBottom: 10 }}>
              Missed terms — the wrong letters are marked
            </div>
            <div className="miss-list">
              {payload.rounds
                .filter((x) => !x.correct)
                .map((round, i) => (
                  <div className="miss-row" key={i}>
                    <span className="typed">
                      {round.typed.trim() === '' ? (
                        <span style={{ color: 'var(--ink-3)' }}>(no answer)</span>
                      ) : (
                        charDiff(round.term, round.typed.trim()).map((c, j) => (
                          <span key={j} className={c.ok ? '' : 'off'}>
                            {c.ch}
                          </span>
                        ))
                      )}
                    </span>
                    <span className="arrow">→</span>
                    <span className="term">{round.term}</span>
                    <span className="clue">{round.clue}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          {next && (
            <button
              className="btn btn-primary"
              onClick={() => navigate({ name: 'drill', sampleId: next.id })}
            >
              Next drill: {next.title}
            </button>
          )}
          <button className="btn btn-secondary" onClick={onRetry}>
            Retry
          </button>
          <a className="btn btn-ghost" href={routeHash({ name: 'progress' })}>
            View progress
          </a>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}
