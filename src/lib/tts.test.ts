import { describe, expect, it } from 'vitest'
import { chunkText, maxChunkLen } from './tts'

describe('maxChunkLen', () => {
  it('scales the chunk budget with playback rate', () => {
    expect(maxChunkLen(1)).toBe(200)
    expect(maxChunkLen(0.5)).toBe(100)
    expect(maxChunkLen(0.25)).toBe(50)
  })

  it('clamps to a sane floor and ceiling', () => {
    expect(maxChunkLen(0.1)).toBe(40)
    expect(maxChunkLen(1.5)).toBe(200)
    expect(maxChunkLen(2)).toBe(200)
  })
})

describe('chunkText', () => {
  const passage =
    'Patient is a 62-year-old woman presenting with three days of intermittent chest tightness. It comes on with exertion, lasts about five minutes, and resolves with rest. She denies shortness of breath.'

  it('keeps whole sentences when they fit the budget', () => {
    const chunks = chunkText(passage, 200)
    expect(chunks.length).toBe(3)
    expect(chunks[0]).toMatch(/chest tightness\.$/)
  })

  it('hard-splits long sentences under a slow-rate budget', () => {
    const chunks = chunkText(passage, 50)
    expect(chunks.every((c) => c.length <= 50)).toBe(true)
    // Nothing is lost in the split.
    expect(chunks.join(' ').replace(/\s+/g, ' ')).toBe(passage.replace(/\s+/g, ' '))
  })

  it('returns nothing for empty text', () => {
    expect(chunkText('', 50)).toEqual([])
  })
})
