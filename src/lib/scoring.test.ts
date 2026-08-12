import { describe, expect, it } from 'vitest'
import {
  LENIENT,
  STRICT,
  charDiff,
  grossWpm,
  scoreTranscription,
  segmentAccuracies,
  termMatches,
  tokenize,
  typingAccuracy,
} from './scoring'

describe('tokenize', () => {
  it('lenient mode strips punctuation and case but keeps internal apostrophes/hyphens', () => {
    expect(tokenize('Dr. Smith said, "Come in!"', LENIENT)).toEqual([
      'dr',
      'smith',
      'said',
      'come',
      'in',
    ])
    expect(tokenize("It's a well-known fact.", LENIENT)).toEqual(['it\'s', 'a', 'well-known', 'fact'])
  })

  it('normalizes typographic characters to keyboard equivalents', () => {
    expect(tokenize('“Hello,” she said…', LENIENT)).toEqual(['hello', 'she', 'said'])
    expect(tokenize('wait—no', LENIENT)).toEqual(['wait', 'no'])
    expect(tokenize('don’t', LENIENT)).toEqual(["don't"])
  })

  it('strict mode keeps punctuation and case', () => {
    expect(tokenize('“Hello,” she said.', STRICT)).toEqual(['"Hello,"', 'she', 'said.'])
    expect(tokenize('S1: Okay.', STRICT)).toEqual(['S1:', 'Okay.'])
  })

  it('drops tokens that normalize to nothing', () => {
    expect(tokenize('salt & pepper', LENIENT)).toEqual(['salt', 'pepper'])
  })
})

describe('scoreTranscription', () => {
  it('perfect lenient match ignores case and punctuation', () => {
    const s = scoreTranscription('Dr. Smith said, "Come in."', 'dr smith said come in', LENIENT)
    expect(s.accuracy).toBe(1)
    expect(s.matches).toBe(5)
    expect(s.subs + s.ins + s.dels).toBe(0)
  })

  it('counts a substitution', () => {
    const s = scoreTranscription('the quick brown fox', 'the quik brown fox', LENIENT)
    expect(s.subs).toBe(1)
    expect(s.accuracy).toBeCloseTo(0.75)
    const sub = s.ops.find((o) => o.type === 'sub')
    expect(sub).toEqual({ type: 'sub', ref: 1, typed: 1 })
  })

  it('counts deletions and insertions', () => {
    const missing = scoreTranscription('a b c d', 'a b', LENIENT)
    expect(missing.dels).toBe(2)
    expect(missing.accuracy).toBeCloseTo(0.5)

    const extra = scoreTranscription('a b', 'a x b', LENIENT)
    expect(extra.ins).toBe(1)
    expect(extra.accuracy).toBeCloseTo(0.5)
  })

  it('empty typed text scores zero; two empties score one', () => {
    expect(scoreTranscription('a b c', '', LENIENT).accuracy).toBe(0)
    expect(scoreTranscription('', '', LENIENT).accuracy).toBe(1)
  })

  it('clamps accuracy at zero when errors exceed reference length', () => {
    const s = scoreTranscription('one two', 'a b c d e f', LENIENT)
    expect(s.accuracy).toBe(0)
  })

  it('strict mode flags punctuation and case differences as substitutions', () => {
    const s = scoreTranscription('[00:04] S1: Okay?', '[00:04] s1: Okay.', STRICT)
    expect(s.matches).toBe(1)
    expect(s.subs).toBe(2)
  })

  it('emits ops in reading order', () => {
    const s = scoreTranscription('a b', 'b', LENIENT)
    expect(s.ops).toEqual([
      { type: 'del', ref: 0 },
      { type: 'match', ref: 1, typed: 0 },
    ])
  })

  it('keeps display tokens aligned with comparison tokens', () => {
    const s = scoreTranscription('salt & pepper', 'salt pepper', LENIENT)
    expect(s.accuracy).toBe(1)
    expect(s.refDisplay).toEqual(['salt', 'pepper'])
  })
})

describe('grossWpm', () => {
  it('computes 5-chars-per-word WPM', () => {
    expect(grossWpm(250, 60_000)).toBe(50)
    expect(grossWpm(250, 30_000)).toBe(100)
  })

  it('guards zero input', () => {
    expect(grossWpm(0, 60_000)).toBe(0)
    expect(grossWpm(100, 0)).toBe(0)
  })
})

describe('typingAccuracy', () => {
  it('is the fraction of clean keypresses, clamped to [0,1]', () => {
    expect(typingAccuracy(100, 5)).toBeCloseTo(0.95)
    expect(typingAccuracy(10, 20)).toBe(0)
    expect(typingAccuracy(0, 0)).toBe(0)
  })
})

describe('segmentAccuracies', () => {
  it('reports all-perfect segments for a perfect transcription', () => {
    const ref = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ')
    const s = scoreTranscription(ref, ref, LENIENT)
    expect(segmentAccuracies(s, 4)).toEqual([1, 1, 1, 1])
  })

  it('localizes errors to the segment they occur in', () => {
    const words = Array.from({ length: 40 }, (_, i) => `w${i}`)
    const ref = words.join(' ')
    const typedDropTail = words.slice(0, 30).join(' ')
    const s = scoreTranscription(ref, typedDropTail, LENIENT)
    expect(segmentAccuracies(s, 4)).toEqual([1, 1, 1, 0])
  })

  it('attributes insertions to the segment in progress', () => {
    const s = scoreTranscription('a b c d', 'x a b c d', LENIENT)
    expect(segmentAccuracies(s, 4)).toEqual([0, 1, 1, 1])
  })

  it('never returns more segments than reference words', () => {
    const s = scoreTranscription('a b', 'a b', LENIENT)
    expect(segmentAccuracies(s, 4)).toEqual([1, 1])
  })
})

describe('charDiff', () => {
  it('marks substituted characters', () => {
    expect(charDiff('lien', 'lean')).toEqual([
      { ch: 'l', ok: true },
      { ch: 'e', ok: false },
      { ch: 'a', ok: false },
      { ch: 'n', ok: true },
    ])
  })

  it('marks inserted characters and tolerates omissions', () => {
    // 'tortt' has one extra char; which duplicate 't' gets flagged is ambiguous.
    const cells = charDiff('tort', 'tortt')
    expect(cells).toHaveLength(5)
    expect(cells.filter((c) => !c.ok)).toHaveLength(1)
    expect(charDiff('subpoena', 'subpena').every((c) => c.ok)).toBe(true)
  })
})

describe('termMatches', () => {
  it('ignores case and surrounding whitespace', () => {
    expect(termMatches('voir dire', '  Voir  Dire ')).toBe(true)
  })

  it('accepts typed straight apostrophes for curly ones', () => {
    expect(termMatches('Crohn’s disease', "crohn's disease")).toBe(true)
  })

  it('rejects different spellings', () => {
    expect(termMatches('metoprolol', 'metropolol')).toBe(false)
  })
})
