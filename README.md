# Top Scriber

A minimalist training platform for professional scribers — medical, legal, and general
transcription. Six skills, 100 curated drills, an AI scenario generator for unlimited fresh
material, and a progress dashboard that tracks what actually matters: per-skill accuracy and
speed trends.

Everything runs in the browser. No backend, no accounts — progress lives in `localStorage`,
audio is synthesized on the fly, and the optional AI generator calls the Anthropic API
directly with your own key.

## Quick start

```sh
npm install
npm run dev        # local dev server
npm test           # scoring engine + library integrity tests
npm run build      # production build in dist/
```

Use Chrome or Edge on desktop for the listening drills — they have the best built-in
speech-synthesis voices. Installing extra system voices (British, Australian, Indian English)
unlocks the accent variety in the Accents & speed module.

## The six skills

| Module | What it trains | How it's scored |
|---|---|---|
| **Typing** | Raw keyboard speed and accuracy on visible passages | Gross WPM (5 chars/word); accuracy = clean keypresses / total; errors highlighted per character, live |
| **Listen & type** | The core scriber skill: transcribing speech in real time | Word-level alignment against the reference; case and punctuation not penalized; replays counted, not punished |
| **Vocabulary** | Medical/legal/business terminology spelled correctly under time pressure | Hear the term + read the clue, spell it before the per-term clock runs out; misses reveal the correct spelling immediately |
| **Formatting** | Timestamps, speaker labels, house-style punctuation | Strict word-level diff — capitalization and punctuation count; line breaks don't |
| **Accents & speed** | Fast talkers, unfamiliar accents, noisy lines | Same as listen & type, but playback speed is locked to the scenario and some scenarios add background noise |
| **Endurance** | Long-form dictation, shift-length focus | Overall accuracy plus per-quarter accuracy, so you can see whether the last quarter held up like the first |

The curated library is exactly 100 samples (18 typing, 22 listen, 18 vocabulary sets,
14 formatting, 16 accent/speed, 12 endurance), each tagged by difficulty
(beginner/intermediate/advanced) and domain (medical/legal/general). A test locks the count
and integrity (`src/data/samples/library.test.ts`).

## How audio works

Drills synthesize speech with the browser's built-in `speechSynthesis` — no audio files.
That makes playback rate, voice/accent selection, and replay free parameters, which is
exactly what adaptability training needs. Background noise for noisy-line scenarios is
generated with the WebAudio API. If a browser has no voices installed, listening drills
say so plainly instead of failing silently.

## AI scenario generator

The **AI scenarios** tab generates a fresh transcript on demand — pick domain, difficulty,
length, accent, speed, and noise, and the result becomes a drill like any other (filed under
the skill it trains). It calls the Anthropic API (`claude-opus-5`, structured JSON output)
directly from the browser:

- You supply your own API key from [console.anthropic.com](https://console.anthropic.com/);
  it's stored only in this browser's `localStorage` and sent only to Anthropic.
- Server-side refusal fallbacks (`fallbacks: "default"`) are enabled, so a request declined
  by safety classifiers is automatically retried on a fallback model instead of failing.
- Generated scenarios are saved locally (capped at 50) and appear in their skill's module
  with an **AI** badge.

## Project layout

```
src/
  lib/            scoring engine, TTS wrapper, noise, storage, router, AI client
    scoring.ts    tokenization, word alignment (edit distance), WER accuracy, char diff
    tts.ts        chunked speechSynthesis playback with voice hints + failure watchdog
  data/
    skills.ts     the six module definitions
    samples/      the 100-sample curated library, one file per skill
  drills/         one component per drill mechanic (typing, transcribe, format, vocab)
  views/          module pages, results, progress dashboard, AI generator
  components/     sidebar, audio bar, diff renderer, sparkline
```

Scoring is the heart: `scoreTranscription` aligns typed words against the reference with a
Levenshtein DP + backtrace, reports substitutions/insertions/deletions, and computes accuracy
as the complement of word error rate. The formatting module runs the same engine in
case- and punctuation-sensitive mode. It's covered by unit tests (`npm test`).

## Deliberately out of scope (v1)

Leaderboards and social features, certification/grading, team/org admin, and live proctoring.
