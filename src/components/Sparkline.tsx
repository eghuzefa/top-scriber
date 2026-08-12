import { useRef, useState } from 'react'

export interface SparkPoint {
  value: number
  label: string
}

interface SparklineProps {
  points: SparkPoint[]
  color: string
  /** Formats the value in the hover tooltip. */
  format: (v: number) => string
  caption: string
}

const W = 240
const H = 48
const PAD = 6

/**
 * Single-series SVG sparkline with a nearest-point hover tooltip.
 * The caption names the series, so no legend is needed.
 */
export function Sparkline({ points, color, format, caption }: SparklineProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  if (points.length === 0) return null

  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const x = (i: number) =>
    points.length === 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (points.length - 1)
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - 2 * PAD)
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const last = points[points.length - 1]

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(x(i) - px)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }
    setHover(best)
  }

  const active = hover !== null ? points[hover] : null

  return (
    <div className="sparkline-wrap" ref={wrapRef}>
      <div className="spark-cap">{caption}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={`${caption}, latest ${format(last.value)}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        style={{ display: 'block', touchAction: 'none' }}
      >
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--line)" strokeWidth="1" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null ? (
          <circle cx={x(hover)} cy={y(points[hover].value)} r="4" fill={color} stroke="var(--surface)" strokeWidth="2" />
        ) : (
          <circle cx={x(points.length - 1)} cy={y(last.value)} r="4" fill={color} stroke="var(--surface)" strokeWidth="2" />
        )}
      </svg>
      {active !== null && hover !== null && (
        <div
          className="spark-tip"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: `${((y(active.value) + 14) / H) * 100}%`,
          }}
        >
          {format(active.value)} · {active.label}
        </div>
      )}
    </div>
  )
}
