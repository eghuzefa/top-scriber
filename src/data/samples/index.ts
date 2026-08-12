import type { Sample, SkillId } from '../../lib/types'
import { TYPING_SAMPLES } from './typing'
import { LISTEN_SAMPLES } from './listen'
import { VOCAB_SAMPLES } from './vocab'
import { FORMAT_SAMPLES } from './format'
import { ADAPT_SAMPLES } from './adapt'
import { ENDURANCE_SAMPLES } from './endurance'

/** The curated practice library: 100 samples across the six skills. */
export const ALL_SAMPLES: Sample[] = [
  ...TYPING_SAMPLES,
  ...LISTEN_SAMPLES,
  ...VOCAB_SAMPLES,
  ...FORMAT_SAMPLES,
  ...ADAPT_SAMPLES,
  ...ENDURANCE_SAMPLES,
]

const ORDER: Record<Sample['difficulty'], number> = { beginner: 0, intermediate: 1, advanced: 2 }

export function samplesForSkill(skill: SkillId): Sample[] {
  return ALL_SAMPLES.filter((s) => s.skill === skill).sort(
    (a, b) => ORDER[a.difficulty] - ORDER[b.difficulty],
  )
}

const BY_ID = new Map(ALL_SAMPLES.map((s) => [s.id, s]))

export function curatedSampleById(id: string): Sample | undefined {
  return BY_ID.get(id)
}
