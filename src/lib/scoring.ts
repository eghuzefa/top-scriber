/**
 * Scoring engine: tokenization, word-level alignment (edit distance with
 * backtrace), WER-based accuracy, char-level diff for spelling feedback,
 * and WPM. Pure functions, no DOM.
 */

export interface TokenizeOptions {
  /** Compare with original casing (formatting drills). */
  caseSensitive: boolean
  /** Keep punctuation attached to tokens (formatting drills). */
  punctuationSensitive: boolean
}

export const LENIENT: TokenizeOptions = { caseSensitive: false, punctuationSensitive: false }
export const STRICT: TokenizeOptions = { caseSensitive: true, punctuationSensitive: true }

/** Map typographic characters to their keyboard equivalents so users are never
 *  penalized for straight quotes or plain hyphens. */
function toKeyboardChars(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[–—]/g, ' ') // dashes separate clauses; never require typing them
}

export function normalizeToken(raw: string, opts: TokenizeOptions): string {
  let tok = raw
  if (!opts.caseSensitive) tok = tok.toLowerCase()
  if (!opts.punctuationSensitive) {
    tok = tok.replace(/[^a-zA-Z0-9'-]/g, '')
    tok = tok.replace(/^['-]+/, '').replace(/['-]+$/, '')
  }
  return tok
}

export function tokenize(text: string, opts: TokenizeOptions): string[] {
  return toKeyboardChars(text)
    .split(/\s+/)
    .map((t) => normalizeToken(t, opts))
    .filter((t) => t.length > 0)
}

export type WordOp =
  | { type: 'match'; ref: number; typed: number }
  | { type: 'sub'; ref: number; typed: number }
  | { type: 'del'; ref: number }
  | { type: 'ins'; typed: number }

export interface TranscriptionScore {
  ops: WordOp[]
  matches: number
  subs: number
  ins: number
  dels: number
  refCount: number
  typedCount: number
  /** max(0, 1 - (S+I+D)/refCount) — the complement of word error rate. */
  accuracy: number
  /** Raw tokens as compared, for rendering the diff. */
  refTokens: string[]
  typedTokens: string[]
  /** Original (display) tokens aligned 1:1 with refTokens/typedTokens. */
  refDisplay: string[]
  typedDisplay: string[]
}

/** Tokens for display keep their punctuation/case but still drop empties in
 *  lock-step with the comparison tokens. */
function displayTokens(text: string, opts: TokenizeOptions): string[] {
  const out: string[] = []
  for (const raw of toKeyboardChars(text).split(/\s+/)) {
    if (normalizeToken(raw, opts).length > 0) out.push(raw)
  }
  return out
}

/**
 * Align two token sequences with Levenshtein DP + backtrace.
 * Ops come out in reading order.
 */
export function alignWords(ref: string[], typed: string[]): WordOp[] {
  const n = ref.length
  const m = typed.length
  const width = m + 1
  // cost[i][j] = edits to convert ref[0..i) into typed[0..j)
  const cost = new Int32Array((n + 1) * width)
  // move: 0 = diag (match/sub), 1 = up (del), 2 = left (ins)
  const move = new Uint8Array((n + 1) * width)
  for (let j = 1; j <= m; j++) {
    cost[j] = j
    move[j] = 2
  }
  for (let i = 1; i <= n; i++) {
    cost[i * width] = i
    move[i * width] = 1
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const same = ref[i - 1] === typed[j - 1]
      const diag = cost[(i - 1) * width + (j - 1)] + (same ? 0 : 1)
      const up = cost[(i - 1) * width + j] + 1
      const left = cost[i * width + (j - 1)] + 1
      // Prefer diagonal on ties: keeps substitutions paired for highlighting.
      if (diag <= up && diag <= left) {
        cost[i * width + j] = diag
        move[i * width + j] = 0
      } else if (up <= left) {
        cost[i * width + j] = up
        move[i * width + j] = 1
      } else {
        cost[i * width + j] = left
        move[i * width + j] = 2
      }
    }
  }
  const ops: WordOp[] = []
  let i = n
  let j = m
  while (i > 0 || j > 0) {
    const mv = move[i * width + j]
    if (i > 0 && j > 0 && mv === 0) {
      ops.push(
        ref[i - 1] === typed[j - 1]
          ? { type: 'match', ref: i - 1, typed: j - 1 }
          : { type: 'sub', ref: i - 1, typed: j - 1 },
      )
      i--
      j--
    } else if (i > 0 && (mv === 1 || j === 0)) {
      ops.push({ type: 'del', ref: i - 1 })
      i--
    } else {
      ops.push({ type: 'ins', typed: j - 1 })
      j--
    }
  }
  ops.reverse()
  return ops
}

export function scoreTranscription(
  refText: string,
  typedText: string,
  opts: TokenizeOptions,
): TranscriptionScore {
  const refTokens = tokenize(refText, opts)
  const typedTokens = tokenize(typedText, opts)
  const ops = alignWords(refTokens, typedTokens)
  let matches = 0
  let subs = 0
  let ins = 0
  let dels = 0
  for (const op of ops) {
    if (op.type === 'match') matches++
    else if (op.type === 'sub') subs++
    else if (op.type === 'ins') ins++
    else dels++
  }
  const refCount = refTokens.length
  const typedCount = typedTokens.length
  const accuracy =
    refCount === 0 ? (typedCount === 0 ? 1 : 0) : Math.max(0, 1 - (subs + ins + dels) / refCount)
  return {
    ops,
    matches,
    subs,
    ins,
    dels,
    refCount,
    typedCount,
    accuracy,
    refTokens,
    typedTokens,
    refDisplay: displayTokens(refText, opts),
    typedDisplay: displayTokens(typedText, opts),
  }
}

/** Gross words-per-minute: one word = 5 typed characters. */
export function grossWpm(charCount: number, ms: number): number {
  if (ms <= 0 || charCount <= 0) return 0
  return charCount / 5 / (ms / 60000)
}

/** Keystroke accuracy for copy-typing drills. */
export function typingAccuracy(totalKeypresses: number, errorKeypresses: number): number {
  if (totalKeypresses <= 0) return 0
  return Math.max(0, Math.min(1, 1 - errorKeypresses / totalKeypresses))
}

/**
 * Split a scored transcription into `parts` segments of the reference and
 * report accuracy for each — shows whether focus held up over a long drill.
 * Insertions count against the segment the writer was in at the time.
 */
export function segmentAccuracies(score: TranscriptionScore, parts = 4): number[] {
  const { refCount, ops } = score
  if (refCount === 0) return []
  const p = Math.min(parts, refCount)
  const bucketOf = (refIdx: number) => Math.min(p - 1, Math.floor((refIdx * p) / refCount))
  const size = new Array<number>(p).fill(0)
  for (let i = 0; i < refCount; i++) size[bucketOf(i)]++
  const errors = new Array<number>(p).fill(0)
  let cursor = 0 // index of the next reference word
  for (const op of ops) {
    if (op.type === 'match') {
      cursor = op.ref + 1
    } else if (op.type === 'sub' || op.type === 'del') {
      errors[bucketOf(op.ref)]++
      cursor = op.ref + 1
    } else {
      errors[bucketOf(Math.min(cursor, refCount - 1))]++
    }
  }
  return errors.map((e, b) => Math.max(0, 1 - e / size[b]))
}

export interface CharCell {
  ch: string
  ok: boolean
}

/**
 * Char-level alignment of a typed answer against the expected spelling.
 * Marks each typed character as matching or not — used for the "you typed"
 * line in vocabulary feedback. Inputs are short (single terms).
 */
export function charDiff(expected: string, typed: string): CharCell[] {
  const a = expected
  const b = typed
  const n = a.length
  const m = b.length
  const width = m + 1
  const cost = new Int32Array((n + 1) * width)
  const move = new Uint8Array((n + 1) * width)
  for (let j = 1; j <= m; j++) {
    cost[j] = j
    move[j] = 2
  }
  for (let i = 1; i <= n; i++) {
    cost[i * width] = i
    move[i * width] = 1
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const same = a[i - 1] === b[j - 1]
      const diag = cost[(i - 1) * width + (j - 1)] + (same ? 0 : 1)
      const up = cost[(i - 1) * width + j] + 1
      const left = cost[i * width + (j - 1)] + 1
      if (diag <= up && diag <= left) {
        cost[i * width + j] = diag
        move[i * width + j] = 0
      } else if (up <= left) {
        cost[i * width + j] = up
        move[i * width + j] = 1
      } else {
        cost[i * width + j] = left
        move[i * width + j] = 2
      }
    }
  }
  const cells: CharCell[] = []
  let i = n
  let j = m
  while (i > 0 || j > 0) {
    const mv = move[i * width + j]
    if (i > 0 && j > 0 && mv === 0) {
      cells.push({ ch: b[j - 1], ok: a[i - 1] === b[j - 1] })
      i--
      j--
    } else if (i > 0 && (mv === 1 || j === 0)) {
      i-- // expected char missing from typed answer; nothing to render
    } else {
      cells.push({ ch: b[j - 1], ok: false })
      j--
    }
  }
  cells.reverse()
  return cells
}

/** Case-insensitive exact match after keyboard-char normalization. */
export function termMatches(expected: string, typed: string): boolean {
  const norm = (s: string) => toKeyboardChars(s).trim().replace(/\s+/g, ' ').toLowerCase()
  return norm(expected) === norm(typed)
}
