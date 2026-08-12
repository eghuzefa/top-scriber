import { useMemo } from 'react'
import { samplesForSkill } from '../data/samples'
import { SKILLS } from '../data/skills'
import { routeHash } from '../lib/router'
import { loadGenerated, loadResults } from '../lib/storage'

export function HomeView() {
  const stats = useMemo(() => {
    const results = loadResults()
    const generated = loadGenerated()
    return SKILLS.map((skill) => {
      const drills = samplesForSkill(skill.id).length + generated.filter((g) => g.skill === skill.id).length
      const mine = results.filter((r) => r.skill === skill.id)
      const recent = mine.slice(-10)
      const avgAcc =
        recent.length === 0 ? null : recent.reduce((a, r) => a + r.accuracy, 0) / recent.length
      return { skill, drills, sessions: mine.length, avgAcc }
    })
  }, [])

  const anySessions = stats.some((s) => s.sessions > 0)

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Train like a scriber.</h1>
        <p className="page-sub">
          Six skills, 100 curated drills, and an AI generator when you want fresh material.
          Pick a skill, run a drill, see exactly what to fix.
        </p>
        {!anySessions && (
          <p className="page-sub" style={{ marginTop: 8 }}>
            New here? Start with a <a href={routeHash({ name: 'skill', skillId: 'typing' })}>typing warm-up</a>{' '}
            or jump straight to <a href={routeHash({ name: 'skill', skillId: 'listen' })}>listen &amp; type</a>.
          </p>
        )}
      </header>

      <div className="skill-grid">
        {stats.map(({ skill, drills, sessions, avgAcc }) => (
          <a key={skill.id} className="skill-card" href={routeHash({ name: 'skill', skillId: skill.id })}>
            <h3>{skill.name}</h3>
            <p>{skill.tagline}</p>
            <div className="meta">
              <span>{drills} drills</span>
              {sessions > 0 && <span>· {sessions} session{sessions === 1 ? '' : 's'}</span>}
              {avgAcc !== null && <span>· avg {Math.round(avgAcc * 100)}%</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
