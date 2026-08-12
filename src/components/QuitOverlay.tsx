interface QuitOverlayProps {
  onResume: () => void
  onQuit: () => void
}

/** Confirmation before abandoning a drill — no accidental exits, no lost work. */
export function QuitOverlay({ onResume, onQuit }: QuitOverlayProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Quit drill?">
      <div className="card">
        <h3>Quit this drill?</h3>
        <p style={{ color: 'var(--ink-2)', fontSize: 13.5 }}>
          Nothing will be scored or saved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={onResume} autoFocus>
            Keep going
          </button>
          <button className="btn btn-secondary" onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>
    </div>
  )
}
