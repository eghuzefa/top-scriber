import type { TranscriptionScore } from '../lib/scoring'
import type { DrillResult } from '../lib/types'

export interface VocabRound {
  term: string
  clue: string
  typed: string
  correct: boolean
  ms: number
}

/** What a finished drill hands back for the results screen. */
export type FinishPayload =
  | { kind: 'typing'; result: DrillResult; text: string; wrongAt: boolean[] }
  | { kind: 'diff'; result: DrillResult; score: TranscriptionScore }
  | { kind: 'vocab'; result: DrillResult; rounds: VocabRound[] }
