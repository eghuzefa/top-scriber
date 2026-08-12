export type SkillId = 'typing' | 'listen' | 'vocab' | 'format' | 'adapt' | 'endurance'
export type Domain = 'medical' | 'legal' | 'general'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type NoiseLevel = 'none' | 'low' | 'high'
export type VoiceHint = 'default' | 'uk' | 'au' | 'in'

interface SampleBase {
  id: string
  skill: SkillId
  domain: Domain
  difficulty: Difficulty
  title: string
  /** Set on samples produced by the AI scenario generator. */
  generated?: boolean
}

/** Copy typing: the passage is visible, type it verbatim. */
export interface TypingSample extends SampleBase {
  kind: 'typing'
  text: string
}

/** Listen-and-type: audio is spoken via TTS, type what you hear. */
export interface TranscribeSample extends SampleBase {
  kind: 'transcribe'
  transcript: string
  /** Playback preset. Drills for the `adapt` skill lock the rate to this value. */
  rate?: number
  voiceHint?: VoiceHint
  noise?: NoiseLevel
}

export interface VocabTerm {
  term: string
  clue: string
}

/** Vocabulary dictation: hear the term, read the clue, spell it before the clock runs out. */
export interface VocabSample extends SampleBase {
  kind: 'vocab'
  terms: VocabTerm[]
  secondsPerTerm: number
}

/** Formatting discipline: rewrite a raw feed into house style, scored strictly. */
export interface FormatSample extends SampleBase {
  kind: 'format'
  raw: string
  formatted: string
}

export type Sample = TypingSample | TranscribeSample | VocabSample | FormatSample

export interface DrillResult {
  id: string
  /** Epoch millis when the drill finished. */
  at: number
  skill: SkillId
  sampleId: string
  sampleTitle: string
  wpm: number
  /** 0..1 */
  accuracy: number
  errors: number
  durationMs: number
  detail?: {
    subs?: number
    ins?: number
    dels?: number
    replays?: number
    /** Per-quarter accuracy (endurance drills). */
    quarters?: number[]
    /** Terms missed (vocab drills). */
    missed?: string[]
  }
}

export interface Settings {
  apiKey?: string
}
