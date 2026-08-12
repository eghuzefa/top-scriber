import type { DrillResult, Sample, Settings, TranscribeSample } from './types'

/**
 * localStorage persistence. Reads survive corrupted or missing data (they
 * return safe defaults and log); writes report success so the UI can tell the
 * user when progress isn't being saved instead of failing silently.
 */

const RESULTS_KEY = 'topscriber.results.v1'
const SETTINGS_KEY = 'topscriber.settings.v1'
const GENERATED_KEY = 'topscriber.generated.v1'
const MAX_RESULTS = 500
const MAX_GENERATED = 50

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as unknown) : null
  } catch (err) {
    console.warn(`Could not read ${key} from localStorage:`, err)
    return null
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn(`Could not write ${key} to localStorage:`, err)
    return false
  }
}

function isResult(r: unknown): r is DrillResult {
  if (typeof r !== 'object' || r === null) return false
  const x = r as Record<string, unknown>
  return (
    typeof x.id === 'string' &&
    typeof x.at === 'number' &&
    typeof x.skill === 'string' &&
    typeof x.sampleId === 'string' &&
    typeof x.wpm === 'number' &&
    typeof x.accuracy === 'number' &&
    typeof x.durationMs === 'number'
  )
}

export function loadResults(): DrillResult[] {
  const raw = read(RESULTS_KEY)
  return Array.isArray(raw) ? raw.filter(isResult) : []
}

export function saveResult(result: DrillResult): boolean {
  const all = [...loadResults(), result].slice(-MAX_RESULTS)
  return write(RESULTS_KEY, all)
}

export function loadSettings(): Settings {
  const raw = read(SETTINGS_KEY)
  if (typeof raw !== 'object' || raw === null) return {}
  const x = raw as Record<string, unknown>
  return { apiKey: typeof x.apiKey === 'string' ? x.apiKey : undefined }
}

export function saveSettings(s: Settings): boolean {
  return write(SETTINGS_KEY, s)
}

function isGeneratedSample(s: unknown): s is TranscribeSample {
  if (typeof s !== 'object' || s === null) return false
  const x = s as Record<string, unknown>
  return (
    x.kind === 'transcribe' &&
    typeof x.id === 'string' &&
    typeof x.title === 'string' &&
    typeof x.transcript === 'string' &&
    typeof x.skill === 'string'
  )
}

export function loadGenerated(): TranscribeSample[] {
  const raw = read(GENERATED_KEY)
  return Array.isArray(raw) ? raw.filter(isGeneratedSample) : []
}

export function addGenerated(sample: TranscribeSample): boolean {
  const all = [sample, ...loadGenerated()].slice(0, MAX_GENERATED)
  return write(GENERATED_KEY, all)
}

export function generatedSampleById(id: string): Sample | undefined {
  return loadGenerated().find((s) => s.id === id)
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
