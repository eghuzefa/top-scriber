import { describe, expect, it } from 'vitest'
import { ALL_SAMPLES } from './index'
import { HOUSE_STYLE } from './format'

describe('practice library', () => {
  it('contains exactly 100 samples', () => {
    expect(ALL_SAMPLES).toHaveLength(100)
  })

  it('has unique ids', () => {
    const ids = new Set(ALL_SAMPLES.map((s) => s.id))
    expect(ids.size).toBe(ALL_SAMPLES.length)
  })

  it('covers every skill and difficulty', () => {
    const skills = new Set(ALL_SAMPLES.map((s) => s.skill))
    expect([...skills].sort()).toEqual(
      ['adapt', 'endurance', 'format', 'listen', 'typing', 'vocab'].sort(),
    )
    for (const skill of skills) {
      const difficulties = new Set(
        ALL_SAMPLES.filter((s) => s.skill === skill).map((s) => s.difficulty),
      )
      expect(difficulties.size, `difficulty spread for ${skill}`).toBeGreaterThanOrEqual(2)
    }
  })

  it('gives every vocab set eight terms with clues', () => {
    for (const s of ALL_SAMPLES) {
      if (s.kind !== 'vocab') continue
      expect(s.terms, s.id).toHaveLength(8)
      for (const t of s.terms) {
        expect(t.term.length, s.id).toBeGreaterThan(0)
        expect(t.clue.length, s.id).toBeGreaterThan(0)
      }
    }
  })

  it('keeps formatting samples consistent: same timestamps in raw and formatted, no fillers left in the target', () => {
    expect(HOUSE_STYLE.length).toBeGreaterThan(0)
    for (const s of ALL_SAMPLES) {
      if (s.kind !== 'format') continue
      const rawStamps = s.raw.match(/\d\d:\d\d/g) ?? []
      const fmtStamps = s.formatted.match(/\[\d\d:\d\d\]/g) ?? []
      expect(fmtStamps.length, s.id).toBe(rawStamps.length)
      expect(s.formatted, s.id).not.toMatch(/\b(um|uh|er)\b/i)
      // Every line follows "[MM:SS] S1: ..." or "[MM:SS] S2: ..."
      for (const line of s.formatted.split('\n')) {
        expect(line, s.id).toMatch(/^\[\d\d:\d\d\] S[12]: \S/)
      }
    }
  })

  it('keeps drills a sane length', () => {
    for (const s of ALL_SAMPLES) {
      if (s.kind === 'typing') {
        expect(s.text.length, s.id).toBeGreaterThan(120)
        expect(s.text.length, s.id).toBeLessThan(700)
      }
      if (s.kind === 'transcribe') {
        const words = s.transcript.split(/\s+/).length
        if (s.skill === 'endurance') {
          expect(words, s.id).toBeGreaterThan(220)
        } else {
          expect(words, s.id).toBeGreaterThan(30)
          expect(words, s.id).toBeLessThan(100)
        }
      }
    }
  })
})
