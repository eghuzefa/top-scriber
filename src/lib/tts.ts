import type { VoiceHint } from './types'

/**
 * Thin, robust wrapper around the browser's speechSynthesis. Text is spoken in
 * sentence-sized chunks (long single utterances get cut off by some engines),
 * and a watchdog surfaces the "no voices installed, nothing happens" case as
 * a real error instead of silence.
 */

export type TtsState = 'idle' | 'playing' | 'paused' | 'ended' | 'error'

export interface TtsSnapshot {
  state: TtsState
  chunkIndex: number
  chunkCount: number
  error?: string
}

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null

/** Voices load asynchronously in most browsers; resolve when ready or after a short timeout. */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!ttsSupported()) return Promise.resolve([])
  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const synth = window.speechSynthesis
      const now = synth.getVoices()
      if (now.length > 0) {
        resolve(now)
        return
      }
      let settled = false
      const finish = () => {
        if (!settled) {
          settled = true
          resolve(synth.getVoices())
        }
      }
      synth.addEventListener('voiceschanged', finish, { once: true })
      window.setTimeout(finish, 1500)
    })
  }
  return voicesPromise
}

const HINT_LANGS: Record<VoiceHint, string[]> = {
  default: ['en-us', 'en'],
  uk: ['en-gb', 'en'],
  au: ['en-au', 'en-gb', 'en'],
  in: ['en-in', 'en-gb', 'en'],
}

export interface VoicePick {
  voice: SpeechSynthesisVoice | null
  /** False when the requested accent had no matching installed voice. */
  exact: boolean
}

export function pickVoice(voices: SpeechSynthesisVoice[], hint: VoiceHint): VoicePick {
  const langs = HINT_LANGS[hint]
  for (let i = 0; i < langs.length; i++) {
    const match = voices.find((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(langs[i]))
    if (match) return { voice: match, exact: i === 0 || hint === 'default' }
  }
  return { voice: voices[0] ?? null, exact: false }
}

/**
 * Some engines cut utterances off after roughly 15 seconds of audio. Scale
 * the chunk budget with playback rate so slow playback stays under that.
 */
export function maxChunkLen(rate: number): number {
  return Math.max(40, Math.min(200, Math.round(200 * rate)))
}

/** Split text into speakable chunks: whole sentences, hard-split when long. */
export function chunkText(text: string, maxLen = 180): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [clean]
  const out: string[] = []
  for (const s of sentences) {
    for (const piece of splitLong(s.trim(), maxLen)) {
      if (piece) out.push(piece)
    }
  }
  return out
}

function splitLong(s: string, maxLen: number): string[] {
  if (s.length <= maxLen) return [s]
  const mid = Math.floor(s.length / 2)
  let cut = -1
  for (const sep of [', ', '; ', ' ']) {
    const left = s.lastIndexOf(sep, mid)
    const right = s.indexOf(sep, mid)
    const best = right !== -1 && (left === -1 || right - mid < mid - left) ? right : left
    if (best > 0 && best < s.length - 1) {
      cut = best
      break
    }
  }
  if (cut <= 0 || cut >= s.length - 1) cut = mid
  return [
    ...splitLong(s.slice(0, cut + 1).trim(), maxLen),
    ...splitLong(s.slice(cut + 1).trim(), maxLen),
  ]
}

export interface TtsOptions {
  rate: number
  voiceHint: VoiceHint
}

const NO_AUDIO_MSG =
  'No speech output. Your browser reports speech support but produced no audio — usually no voices are installed. Chrome or Edge on desktop work best.'

export class TtsPlayer {
  private chunks: string[] = []
  private idx = 0
  private gen = 0
  private rate = 1
  private voiceHint: VoiceHint = 'default'
  private voice: SpeechSynthesisVoice | null = null
  private voiceExact = true
  private watchdog: number | undefined
  private snap: TtsSnapshot = { state: 'idle', chunkIndex: 0, chunkCount: 0 }

  constructor(private onChange: (s: TtsSnapshot) => void) {}

  get snapshot(): TtsSnapshot {
    return this.snap
  }

  /** False when the requested accent fell back to a different installed voice. */
  get voiceMatchedHint(): boolean {
    return this.voiceExact
  }

  load(text: string, opts: TtsOptions): void {
    this.stop()
    this.chunks = chunkText(text, maxChunkLen(opts.rate))
    this.rate = opts.rate
    this.voiceHint = opts.voiceHint
    this.set({ state: 'idle', chunkIndex: 0, chunkCount: this.chunks.length })
  }

  /**
   * Change speed. The unspoken remainder is re-chunked for the new rate, and
   * if audio was playing the current chunk restarts immediately at the new
   * speed. If it was paused, playback holds position; Play resumes it.
   */
  setRate(rate: number): void {
    this.rate = rate
    const done = this.chunks.slice(0, this.idx)
    const rest = this.chunks.slice(this.idx).join(' ')
    this.chunks = [...done, ...chunkText(rest, maxChunkLen(rate))]
    const wasPlaying = this.snap.state === 'playing'
    const wasPaused = this.snap.state === 'paused'
    if (wasPlaying || wasPaused) {
      this.gen++
      this.clearWatchdog()
      window.speechSynthesis.cancel()
      if (wasPlaying) {
        this.speakFrom(this.idx, false)
      } else {
        this.set({ state: 'idle', chunkIndex: this.idx, chunkCount: this.chunks.length })
      }
    } else {
      this.set({ ...this.snap, chunkCount: this.chunks.length })
    }
  }

  async play(): Promise<void> {
    if (!ttsSupported()) {
      this.fail('Speech synthesis is not available in this browser.')
      return
    }
    if (this.snap.state === 'paused') {
      window.speechSynthesis.resume()
      this.set({ ...this.snap, state: 'playing' })
      return
    }
    if (this.snap.state === 'playing') return
    const voices = await loadVoices()
    const pick = pickVoice(voices, this.voiceHint)
    this.voice = pick.voice
    this.voiceExact = pick.exact
    if (this.snap.state === 'ended') this.idx = 0
    this.gen++
    window.speechSynthesis.cancel()
    this.speakFrom(this.idx, true)
  }

  pause(): void {
    if (this.snap.state !== 'playing' || !ttsSupported()) return
    window.speechSynthesis.pause()
    this.set({ ...this.snap, state: 'paused' })
  }

  restart(): void {
    this.idx = 0
    if (!ttsSupported()) return
    this.gen++
    window.speechSynthesis.cancel()
    this.speakFrom(0, true)
  }

  stop(): void {
    this.gen++
    this.clearWatchdog()
    if (ttsSupported()) window.speechSynthesis.cancel()
    this.idx = 0
    this.set({ state: 'idle', chunkIndex: 0, chunkCount: this.chunks.length })
  }

  private speakFrom(i: number, watch: boolean): void {
    const gen = this.gen
    if (i >= this.chunks.length) {
      this.set({ state: 'ended', chunkIndex: this.chunks.length, chunkCount: this.chunks.length })
      return
    }
    this.idx = i
    const u = new SpeechSynthesisUtterance(this.chunks[i])
    u.rate = Math.min(2, Math.max(0.25, this.rate))
    if (this.voice) u.voice = this.voice
    u.onstart = () => {
      if (gen !== this.gen) return
      this.clearWatchdog()
    }
    u.onend = () => {
      if (gen !== this.gen) return
      this.speakFrom(i + 1, false)
    }
    u.onerror = (e) => {
      if (gen !== this.gen) return
      // cancel() fires these on every engine; they are not failures.
      if (e.error === 'interrupted' || e.error === 'canceled') return
      this.clearWatchdog()
      this.fail(`Speech playback failed (${e.error || 'unknown error'}).`)
    }
    if (watch) this.armWatchdog(gen)
    window.speechSynthesis.speak(u)
    this.set({ state: 'playing', chunkIndex: i, chunkCount: this.chunks.length })
  }

  private armWatchdog(gen: number): void {
    this.clearWatchdog()
    this.watchdog = window.setTimeout(() => {
      if (gen !== this.gen || this.snap.state !== 'playing') return
      window.speechSynthesis.cancel()
      this.fail(NO_AUDIO_MSG)
    }, 4000)
  }

  private clearWatchdog(): void {
    if (this.watchdog !== undefined) {
      window.clearTimeout(this.watchdog)
      this.watchdog = undefined
    }
  }

  private fail(message: string): void {
    this.set({ ...this.snap, state: 'error', error: message })
  }

  private set(s: TtsSnapshot): void {
    this.snap = s
    this.onChange(s)
  }
}
