import type { SkillId } from '../lib/types'

export interface SkillMeta {
  id: SkillId
  /** Sidebar label. */
  short: string
  /** Full module name. */
  name: string
  /** One-liner shown on the module page. */
  tagline: string
  /** How the drill works and how it is scored. */
  how: string
}

export const SKILLS: SkillMeta[] = [
  {
    id: 'typing',
    short: 'Typing',
    name: 'Typing speed & accuracy',
    tagline: 'Raw keyboard mechanics. Copy the passage exactly as shown.',
    how: 'The timer starts on your first keystroke and stops on the last character. Gross WPM counts five characters as a word; accuracy is clean keypresses over total keypresses. Mistyped characters stay highlighted until you fix them.',
  },
  {
    id: 'listen',
    short: 'Listen & type',
    name: 'Listen & type',
    tagline: 'The core scribe skill: transcribe provider dictation in real time.',
    how: 'Press play and type what you hear. Pausing and replaying is allowed — replays are counted, not punished. Scoring compares your words against the reference; case and punctuation are not penalized here.',
  },
  {
    id: 'vocab',
    short: 'Vocabulary',
    name: 'Domain vocabulary',
    tagline: 'Hear the term, read the clue, spell it before the clock runs out.',
    how: 'Each term is spoken aloud and shown as a definition. Type the term and press Enter before time expires. Misses show the correct spelling immediately — that is the moment the spelling sticks.',
  },
  {
    id: 'format',
    short: 'Formatting',
    name: 'Formatting discipline',
    tagline: 'Turn raw dictation into chart notes and clean transcripts: sections, labels, punctuation.',
    how: 'Rewrite the raw feed following the style card shown beside it — chart sections for medical dictations, speaker labels and timestamps for dialogues. Scoring is strict: capitalization and punctuation count on every word. Line breaks are not scored.',
  },
  {
    id: 'adapt',
    short: 'Accents & speed',
    name: 'Accents & speed',
    tagline: 'Fast talkers, unfamiliar accents, noisy lines.',
    how: 'Same rules as Listen & type, but playback is locked to the scenario: the speed stays where the scenario sets it, and some scenarios add line noise. Accent variety depends on the voices installed in your browser.',
  },
  {
    id: 'endurance',
    short: 'Endurance',
    name: 'Endurance & focus',
    tagline: 'Long-form dictation that simulates real shift conditions.',
    how: 'One long take. Besides overall accuracy, your transcript is scored in four segments — the score that matters is whether the last quarter holds up like the first.',
  },
]

export const SKILL_BY_ID: Record<SkillId, SkillMeta> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillMeta>
