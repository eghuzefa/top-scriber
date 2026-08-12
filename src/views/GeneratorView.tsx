import { useMemo, useState } from 'react'
import { SKILL_BY_ID } from '../data/skills'
import {
  generateScenario,
  scenarioSkill,
  ScenarioError,
  WORD_TARGETS,
  type ScenarioRequest,
} from '../lib/ai'
import { navigate } from '../lib/router'
import { addGenerated, loadSettings, saveSettings } from '../lib/storage'
import type { TranscribeSample } from '../lib/types'

type Status =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'done'; sample: TranscribeSample }

export function GeneratorView() {
  const [apiKey, setApiKey] = useState(() => loadSettings().apiKey ?? '')
  const [req, setReq] = useState<ScenarioRequest>({
    domain: 'medical',
    difficulty: 'intermediate',
    length: 'short',
    voiceHint: 'default',
    rate: 1,
    noise: 'none',
  })
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  const trains = useMemo(() => SKILL_BY_ID[scenarioSkill(req)], [req])
  const set = <K extends keyof ScenarioRequest>(key: K, value: ScenarioRequest[K]) =>
    setReq((r) => ({ ...r, [key]: value }))

  const generate = async () => {
    const key = apiKey.trim()
    if (!key) {
      setStatus({ state: 'error', message: 'Add your Anthropic API key first — it stays on this device.' })
      return
    }
    saveSettings({ apiKey: key })
    setStatus({ state: 'loading' })
    try {
      const sample = await generateScenario(key, req)
      if (!addGenerated(sample)) {
        setStatus({
          state: 'error',
          message: "The scenario was generated but couldn't be saved to browser storage, so it can't be drilled.",
        })
        return
      }
      setStatus({ state: 'done', sample })
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof ScenarioError ? err.message : 'Something unexpected went wrong.',
      })
    }
  }

  const loading = status.state === 'loading'

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">AI scenarios</h1>
        <p className="page-sub">
          Unlimited practice once the curated library feels familiar: pick a domain, difficulty,
          and voice, and a fresh audio-plus-transcript drill is generated on demand.
        </p>
      </header>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="field">
          <label htmlFor="api-key">Anthropic API key</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            placeholder="sk-ant-…"
            autoComplete="off"
            onChange={(e) => setApiKey(e.target.value)}
          />
          <span className="hint">
            Stored only in this browser and sent only to Anthropic. Create one at{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">
              console.anthropic.com
            </a>
            . Generation uses Claude Opus 5.
          </span>
        </div>
      </div>

      <div className="card">
        <div className="gen-form">
          <div className="field">
            <label htmlFor="gen-domain">Domain</label>
            <select id="gen-domain" value={req.domain} onChange={(e) => set('domain', e.target.value as ScenarioRequest['domain'])}>
              <option value="medical">Medical</option>
              <option value="legal">Legal</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="gen-difficulty">Difficulty</label>
            <select
              id="gen-difficulty"
              value={req.difficulty}
              onChange={(e) => set('difficulty', e.target.value as ScenarioRequest['difficulty'])}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="gen-length">Length</label>
            <select id="gen-length" value={req.length} onChange={(e) => set('length', e.target.value as ScenarioRequest['length'])}>
              <option value="short">Short (~{WORD_TARGETS.short} words)</option>
              <option value="medium">Medium (~{WORD_TARGETS.medium} words)</option>
              <option value="long">Long (~{WORD_TARGETS.long} words, endurance)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="gen-accent">Accent</label>
            <select
              id="gen-accent"
              value={req.voiceHint}
              onChange={(e) => set('voiceHint', e.target.value as ScenarioRequest['voiceHint'])}
            >
              <option value="default">System default</option>
              <option value="uk">British English</option>
              <option value="au">Australian English</option>
              <option value="in">Indian English</option>
            </select>
            <span className="hint">Depends on the voices installed in your browser.</span>
          </div>
          <div className="field">
            <label htmlFor="gen-speed">Playback speed</label>
            <select id="gen-speed" value={req.rate} onChange={(e) => set('rate', Number(e.target.value))}>
              <option value={1}>1× normal</option>
              <option value={1.15}>1.15× brisk</option>
              <option value={1.3}>1.3× fast talker</option>
              <option value={1.5}>1.5× auctioneer</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="gen-noise">Background noise</label>
            <select id="gen-noise" value={req.noise} onChange={(e) => set('noise', e.target.value as ScenarioRequest['noise'])}>
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => void generate()} disabled={loading}>
            {loading ? 'Generating…' : 'Generate scenario'}
          </button>
          <span className="chip">trains: {trains.short}</span>
          {loading && <span className="type-unfocused">Usually 15–30 seconds.</span>}
        </div>

        {status.state === 'error' && <div className="notice notice-error">{status.message}</div>}
      </div>

      {status.state === 'done' && (
        <div className="card gen-preview" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 650 }}>{status.sample.title}</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <span className="chip chip-accent">AI</span>
            <span className="chip">{status.sample.domain}</span>
            <span className="chip">{status.sample.difficulty}</span>
            <span className="chip">{status.sample.transcript.split(/\s+/).length} words</span>
            <span className="chip">trains: {SKILL_BY_ID[status.sample.skill].short}</span>
          </div>
          <p className="transcript-teaser">
            “{status.sample.transcript.split(/\s+/).slice(0, 10).join(' ')}…” — the rest stays
            hidden until you've typed it.
          </p>
          <div className="result-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate({ name: 'drill', sampleId: status.sample.id })}
            >
              Start drill
            </button>
            <button className="btn btn-secondary" onClick={() => setStatus({ state: 'idle' })}>
              Generate another
            </button>
          </div>
          <p className="hint" style={{ color: 'var(--ink-3)', fontSize: 12.5, marginTop: 10 }}>
            Saved to your {SKILL_BY_ID[status.sample.skill].short} module in this browser.
          </p>
        </div>
      )}
    </div>
  )
}
