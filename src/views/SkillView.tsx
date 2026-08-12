import { useMemo } from 'react'
import { samplesForSkill } from '../data/samples'
import { SKILL_BY_ID } from '../data/skills'
import { routeHash } from '../lib/router'
import { loadGenerated, loadResults } from '../lib/storage'
import type { Sample, SkillId } from '../lib/types'

function sampleSize(sample: Sample): string {
  switch (sample.kind) {
    case 'typing':
      return `${sample.text.split(/\s+/).length} words`
    case 'transcribe':
      return `${sample.transcript.split(/\s+/).length} words`
    case 'vocab':
      return `${sample.terms.length} terms · ${sample.secondsPerTerm}s each`
    case 'format':
      return `${sample.formatted.split('\n').length} ${sample.rules ? 'sections' : 'turns'}`
  }
}

export function SkillView({ skillId }: { skillId: SkillId }) {
  const meta = SKILL_BY_ID[skillId]

  const { medical, other, generated, bestBySample } = useMemo(() => {
    const best = new Map<string, number>()
    for (const r of loadResults()) {
      if (r.skill !== skillId) continue
      const prev = best.get(r.sampleId)
      if (prev === undefined || r.accuracy > prev) best.set(r.sampleId, r.accuracy)
    }
    const curated = samplesForSkill(skillId)
    return {
      medical: curated.filter((s) => s.domain === 'medical'),
      other: curated.filter((s) => s.domain !== 'medical'),
      generated: loadGenerated().filter((g) => g.skill === skillId),
      bestBySample: best,
    }
  }, [skillId])

  const row = (sample: Sample, showDomain: boolean) => {
    const best = bestBySample.get(sample.id)
    return (
      <a key={sample.id} className="sample-row" href={routeHash({ name: 'drill', sampleId: sample.id })}>
        <span className="title">{sample.title}</span>
        {sample.generated && <span className="chip chip-accent">AI</span>}
        {showDomain && <span className="chip">{sample.domain}</span>}
        <span className="chip">{sample.difficulty}</span>
        <span className="size">{sampleSize(sample)}</span>
        {best !== undefined ? (
          <span className="best">best {Math.round(best * 100)}%</span>
        ) : (
          <span className="size">not tried</span>
        )}
      </a>
    )
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">{meta.name}</h1>
        <p className="page-sub">{meta.tagline}</p>
        <p className="page-how">{meta.how}</p>
      </header>

      {medical.length > 0 && (
        <section className="sample-group">
          <h2>Medical scribe</h2>
          <div className="sample-list">{medical.map((s) => row(s, false))}</div>
        </section>
      )}

      {other.length > 0 && (
        <section className="sample-group">
          <h2>Legal &amp; general</h2>
          <div className="sample-list">{other.map((s) => row(s, true))}</div>
        </section>
      )}

      {generated.length > 0 && (
        <section className="sample-group">
          <h2>Your AI scenarios</h2>
          <div className="sample-list">{generated.map((s) => row(s, true))}</div>
        </section>
      )}

      {(skillId === 'listen' || skillId === 'adapt' || skillId === 'endurance') && (
        <p className="page-sub" style={{ marginTop: 24, fontSize: 13 }}>
          Want fresh material? <a href={routeHash({ name: 'generate' })}>Generate a scenario</a> with
          your own domain, difficulty, and voice settings.
        </p>
      )}
    </div>
  )
}
