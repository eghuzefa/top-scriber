import type {
  Difficulty,
  Domain,
  NoiseLevel,
  SkillId,
  TranscribeSample,
  VoiceHint,
} from './types'
import { newId } from './storage'

/**
 * AI scenario generator. Runs entirely in the browser with the user's own
 * Anthropic API key (stored locally, sent only to Anthropic). Server-side
 * refusal fallbacks are enabled so a declined request is retried on a
 * fallback model automatically. The SDK is loaded on demand so it stays out
 * of the app's initial bundle.
 */

type SdkModule = typeof import('@anthropic-ai/sdk')

let sdkPromise: Promise<SdkModule> | null = null
function loadSdk(): Promise<SdkModule> {
  sdkPromise ??= import('@anthropic-ai/sdk')
  return sdkPromise
}

export interface ScenarioRequest {
  domain: Domain
  difficulty: Difficulty
  length: 'short' | 'medium' | 'long'
  voiceHint: VoiceHint
  rate: number
  noise: NoiseLevel
}

export const WORD_TARGETS: Record<ScenarioRequest['length'], number> = {
  short: 70,
  medium: 140,
  long: 340,
}

/** Which skill a generated scenario trains, from its playback settings. */
export function scenarioSkill(req: ScenarioRequest): SkillId {
  if (req.length === 'long') return 'endurance'
  if (req.rate > 1.05 || req.noise !== 'none' || req.voiceHint !== 'default') return 'adapt'
  return 'listen'
}

const DOMAIN_NOTES: Record<Domain, string> = {
  medical:
    'a clinical setting: a dictated visit note, nurse handoff, pharmacy or radiology callback, or patient instructions',
  legal:
    'a legal setting: an attorney voicemail, court announcement, deposition remarks, client intake, or clerk recording',
  general:
    'a professional setting: a team briefing, support call summary, interview answer, earnings remarks, or podcast segment',
}

const DIFFICULTY_NOTES: Record<Difficulty, string> = {
  beginner: 'Use everyday vocabulary, short sentences, and no specialized jargon.',
  intermediate:
    'Use moderate domain terminology, with a few numbers, dates, or measurements where natural.',
  advanced:
    'Use dense, precise domain terminology, specific figures, and longer sentence structures.',
}

const SCENARIO_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Short specific title for the drill, 3-6 words, no quotes around it.',
    },
    transcript: {
      type: 'string',
      description: 'The spoken passage, plain prose, single speaker.',
    },
  },
  required: ['title', 'transcript'],
  additionalProperties: false,
}

export class ScenarioError extends Error {}

function buildPrompt(req: ScenarioRequest): string {
  const words = WORD_TARGETS[req.length]
  return [
    'You are writing practice material for a transcription training app. Trainees listen to the passage read aloud by a text-to-speech voice and type what they hear.',
    '',
    `Write one original spoken passage set in ${DOMAIN_NOTES[req.domain]}.`,
    '',
    'Requirements:',
    '- A single speaker, natural spoken register, as if talking rather than writing. No headings, lists, stage directions, or speaker labels.',
    `- About ${words} words (within 15% either way).`,
    `- ${DIFFICULTY_NOTES[req.difficulty]}`,
    '- Entirely fictional and generic: invent names and details, and do not reference real people, patients, cases, or companies.',
    '- Punctuate for natural text-to-speech phrasing. Avoid characters that are awkward to dictate, like parentheses or slashes.',
  ].join('\n')
}

interface RawScenario {
  title: string
  transcript: string
}

function parseScenario(text: string): RawScenario {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new ScenarioError('The model returned something unreadable. Try generating again.')
  }
  if (typeof raw !== 'object' || raw === null) {
    throw new ScenarioError('The model returned an unexpected shape. Try generating again.')
  }
  const obj = raw as Record<string, unknown>
  const title = typeof obj.title === 'string' ? obj.title.trim() : ''
  const transcript = typeof obj.transcript === 'string' ? obj.transcript.trim() : ''
  if (!title || !transcript || transcript.split(/\s+/).length < 25) {
    throw new ScenarioError('The generated scenario came back too short. Try generating again.')
  }
  return { title: title.slice(0, 80), transcript }
}

export async function generateScenario(
  apiKey: string,
  req: ScenarioRequest,
): Promise<TranscribeSample> {
  const sdk = await loadSdk()
  const client = new sdk.default({
    apiKey,
    dangerouslyAllowBrowser: true,
    timeout: 120_000,
  })

  let response
  try {
    response = await client.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: {
        format: { type: 'json_schema', schema: SCENARIO_SCHEMA },
      },
      messages: [{ role: 'user', content: buildPrompt(req) }],
    })
  } catch (err) {
    throw new ScenarioError(describeApiError(sdk, err))
  }

  if (response.stop_reason === 'refusal') {
    throw new ScenarioError(
      'The model declined to generate this scenario. Adjust the settings and try again.',
    )
  }
  if (response.stop_reason === 'max_tokens') {
    throw new ScenarioError('The generation ran too long and was cut off. Try a shorter length.')
  }

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new ScenarioError('The model returned no text. Try generating again.')
  }

  const scenario = parseScenario(textBlock.text)
  return {
    id: newId('gen'),
    kind: 'transcribe',
    skill: scenarioSkill(req),
    domain: req.domain,
    difficulty: req.difficulty,
    title: scenario.title,
    transcript: scenario.transcript,
    rate: req.rate !== 1 ? req.rate : undefined,
    voiceHint: req.voiceHint !== 'default' ? req.voiceHint : undefined,
    noise: req.noise !== 'none' ? req.noise : undefined,
    generated: true,
  }
}

function describeApiError(sdk: SdkModule, err: unknown): string {
  const A = sdk.default
  if (err instanceof A.AuthenticationError) {
    return 'Anthropic rejected the API key. Check the key and try again.'
  }
  if (err instanceof A.PermissionDeniedError) {
    return 'This API key does not have permission to use the model.'
  }
  if (err instanceof A.RateLimitError) {
    return 'Rate limited by the API. Wait a minute, then try again.'
  }
  if (err instanceof A.BadRequestError) {
    return `The API rejected the request: ${err.message}`
  }
  if (err instanceof A.APIConnectionError) {
    return 'Could not reach the Anthropic API. Check your connection and try again.'
  }
  if (err instanceof A.APIError) {
    return `The API returned an error (${err.status ?? 'unknown'}): ${err.message}`
  }
  return 'Something unexpected went wrong while generating. Try again.'
}
