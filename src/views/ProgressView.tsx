import { useMemo } from 'react'
import { Sparkline, type SparkPoint } from '../components/Sparkline'
import { SKILLS, SKILL_BY_ID } from '../data/skills'
import { formatClock } from '../drills/TypingDrill'
import { routeHash } from '../lib/router'
import { loadResults } from '../lib/storage'
import type { DrillResult } from '../lib/types'

const pct = (v: number) => `${Math.round(v * 100)}%`

function shortDate(at: number): string {
  return new Date(at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function ProgressView() {
  const results = useMemo(() => loadResults(), [])

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <h1 className="page-title">No sessions yet</h1>
        <p>
          Your per-skill trends land here after your first drill — accuracy and speed over time,
          not vanity streaks.
        </p>
        <a className="btn btn-primary" href={routeHash({ name: 'skill', skillId: 'typing' })}>
          Start your first drill
        </a>
      </div>
    )
  }

  const totalMs = results.reduce((a, r) => a + r.durationMs, 0)
  const recent = results.slice(-20)
  const overallAcc = recent.reduce((a, r) => a + r.accuracy, 0) / recent.length

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Progress</h1>
        <p className="page-sub">
          {results.length} session{results.length === 1 ? '' : 's'} ·{' '}
          {formatClock(totalMs)} practiced · {pct(overallAcc)} average accuracy over the last{' '}
          {recent.length}.
        </p>
      </header>

      <div className="progress-grid">
        {SKILLS.map((skill) => {
          const mine = results.filter((r) => r.skill === skill.id)
          if (mine.length === 0) {
            return (
              <div className="card progress-card" key={skill.id}>
                <h3>{skill.name}</h3>
                <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 8 }}>
                  No sessions yet — <a href={routeHash({ name: 'skill', skillId: skill.id })}>start one</a>.
                </p>
              </div>
            )
          }
          const last10 = mine.slice(-10)
          const avgAcc = last10.reduce((a, r) => a + r.accuracy, 0) / last10.length
          const bestWpm = Math.max(...mine.map((r) => r.wpm))
          const accPoints: SparkPoint[] = mine.slice(-20).map((r) => ({
            value: r.accuracy * 100,
            label: shortDate(r.at),
          }))
          const wpmPoints: SparkPoint[] = mine.slice(-20).map((r) => ({
            value: r.wpm,
            label: shortDate(r.at),
          }))
          return (
            <div className="card progress-card" key={skill.id}>
              <h3>{skill.name}</h3>
              <div className="figures">
                <div className="figure">
                  <div className="num">{mine.length}</div>
                  <div className="cap">sessions</div>
                </div>
                <div className="figure">
                  <div className="num">{pct(avgAcc)}</div>
                  <div className="cap">avg accuracy (last 10)</div>
                </div>
                {skill.id !== 'vocab' && (
                  <div className="figure">
                    <div className="num">{bestWpm}</div>
                    <div className="cap">best wpm</div>
                  </div>
                )}
              </div>
              <Sparkline
                points={accPoints}
                color="var(--chart-2)"
                caption="Accuracy trend"
                format={(v) => `${Math.round(v)}%`}
              />
              {skill.id !== 'vocab' && wpmPoints.length > 1 && (
                <Sparkline
                  points={wpmPoints}
                  color="var(--chart-1)"
                  caption="WPM trend"
                  format={(v) => `${Math.round(v)} wpm`}
                />
              )}
            </div>
          )
        })}
      </div>

      <section className="sample-group">
        <h2>Recent sessions</h2>
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="session-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Skill</th>
                <th>Drill</th>
                <th>Accuracy</th>
                <th>WPM</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {[...results].reverse().slice(0, 12).map((r: DrillResult) => (
                <tr key={r.id}>
                  <td>{shortDate(r.at)}</td>
                  <td>{SKILL_BY_ID[r.skill]?.short ?? r.skill}</td>
                  <td className="sample-name">{r.sampleTitle}</td>
                  <td>{pct(r.accuracy)}</td>
                  <td>{r.skill === 'vocab' ? '—' : r.wpm}</td>
                  <td>{formatClock(r.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
