import { useEffect, useMemo, useState } from 'react'
import { curatedSampleById } from '../data/samples'
import { FormatDrill } from '../drills/FormatDrill'
import { TranscribeDrill } from '../drills/TranscribeDrill'
import { TypingDrill } from '../drills/TypingDrill'
import { VocabDrill } from '../drills/VocabDrill'
import type { FinishPayload } from '../drills/payload'
import { navigate } from '../lib/router'
import { generatedSampleById, saveResult } from '../lib/storage'
import { ResultsView } from './ResultsView'

export function DrillView({ sampleId }: { sampleId: string }) {
  const [attempt, setAttempt] = useState(0)
  const [outcome, setOutcome] = useState<{ payload: FinishPayload; saved: boolean } | null>(null)

  const sample = useMemo(
    () => curatedSampleById(sampleId) ?? generatedSampleById(sampleId),
    [sampleId],
  )

  // Fresh state when navigating between drills.
  useEffect(() => {
    setOutcome(null)
    setAttempt(0)
  }, [sampleId])

  if (!sample) {
    return (
      <div className="drill">
        <div className="drill-body" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <h2>Drill not found</h2>
          <p style={{ color: 'var(--ink-2)' }}>
            This practice sample doesn't exist here. AI-generated scenarios live only in the
            browser that created them.
          </p>
          <p>
            <a href="#/">Back to home</a>
          </p>
        </div>
      </div>
    )
  }

  const onFinish = (payload: FinishPayload) => {
    const saved = saveResult(payload.result)
    setOutcome({ payload, saved })
  }
  const onQuit = () => navigate({ name: 'skill', skillId: sample.skill })

  if (outcome) {
    return (
      <ResultsView
        sample={sample}
        payload={outcome.payload}
        saved={outcome.saved}
        onRetry={() => {
          setOutcome(null)
          setAttempt((a) => a + 1)
        }}
      />
    )
  }

  const key = `${sample.id}:${attempt}`
  switch (sample.kind) {
    case 'typing':
      return <TypingDrill key={key} sample={sample} onFinish={onFinish} onQuit={onQuit} />
    case 'transcribe':
      return <TranscribeDrill key={key} sample={sample} onFinish={onFinish} onQuit={onQuit} />
    case 'vocab':
      return <VocabDrill key={key} sample={sample} onFinish={onFinish} onQuit={onQuit} />
    case 'format':
      return <FormatDrill key={key} sample={sample} onFinish={onFinish} onQuit={onQuit} />
  }
}
