import { Fragment } from 'react'
import type { TranscriptionScore } from '../lib/scoring'

/**
 * Inline word-level diff: the reference text annotated with what the writer
 * actually typed. Wrong words show typed → expected; missed words are dotted;
 * extra words are struck through.
 */
export function DiffView({ score }: { score: TranscriptionScore }) {
  return (
    <div>
      <div className="diff-legend" aria-hidden="true">
        <span className="key">
          <span className="tok tok-sub">
            <span className="typed-wrong">typed</span>
            <span className="expected">expected</span>
          </span>
          wrong word
        </span>
        <span className="key">
          <span className="tok tok-del">missed word</span>
        </span>
        <span className="key">
          <span className="tok tok-ins">extra word</span>
        </span>
      </div>
      <div className="diff-view">
        {score.ops.map((op, i) => (
          <Fragment key={i}>
            {op.type === 'match' && <span className="tok">{score.refDisplay[op.ref]}</span>}
            {op.type === 'sub' && (
              <span className="tok tok-sub">
                <span className="typed-wrong">{score.typedDisplay[op.typed]}</span>
                <span className="expected">{score.refDisplay[op.ref]}</span>
              </span>
            )}
            {op.type === 'del' && (
              <span className="tok tok-del" title="You missed this word">
                {score.refDisplay[op.ref]}
              </span>
            )}
            {op.type === 'ins' && (
              <span className="tok tok-ins" title="Extra word you typed">
                {score.typedDisplay[op.typed]}
              </span>
            )}{' '}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
