import { useState, useMemo, useEffect } from 'react'

/**
 * ProgressChart
 * SVG line chart showing weight progression for a chosen exercise.
 * Filters by routine → exercise and plots (date, weight) pairs.
 * Props:
 *   logs     — all log entries
 *   routines — all routines (for the selector)
 */
export default function ProgressChart({ logs, routines }) {
  const [selRoutine,  setSelRoutine]  = useState(routines[0]?.id ?? '')
  const [selExercise, setSelExercise] = useState('')

  // Gather exercise names from logs matching the selected routine
  const exerciseNames = useMemo(() => {
    const seen = new Set()
    logs.filter(l => l.routineId === selRoutine).forEach(l => l.exercises.forEach(e => seen.add(e.name)))
    return [...seen]
  }, [selRoutine, logs])

  // Auto-select first exercise when routine changes
  useEffect(() => {
    if (exerciseNames.length > 0 && !exerciseNames.includes(selExercise)) {
      setSelExercise(exerciseNames[0])
    }
  }, [exerciseNames])

  // Build sorted (date, weight) data points for the chart
  const pts = useMemo(() =>
    logs
      .filter(l => l.routineId === selRoutine)
      .map(l => {
        const ex = l.exercises.find(e => e.name === selExercise && e.completed)
        return ex ? { date: l.date, w: ex.weight, u: ex.unit } : null
      })
      .filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [logs, selRoutine, selExercise]
  )

  // ── SVG dimensions ──
  const W = 560, H = 180
  const PAD = { t: 18, r: 16, b: 36, l: 44 }
  const cW = W - PAD.l - PAD.r
  const cH = H - PAD.t - PAD.b

  const minW = pts.length ? Math.min(...pts.map(d => d.w)) : 0
  const maxW = pts.length ? Math.max(...pts.map(d => d.w)) : 100
  const rng  = maxW - minW || 10

  const toX = i => PAD.l + (i / Math.max(pts.length - 1, 1)) * cW
  const toY = w => PAD.t + cH - ((w - minW) / rng) * cH

  const linePath = pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.w).toFixed(1)}`).join(' ')
  const areaPath = pts.length > 0
    ? `${linePath} L${toX(pts.length - 1).toFixed(1)},${(PAD.t + cH).toFixed(1)} L${toX(0).toFixed(1)},${(PAD.t + cH).toFixed(1)} Z`
    : ''

  const progress = pts.length > 1 ? pts[pts.length - 1].w - pts[0].w : 0

  return (
    <div>
      {/* ── Selectors ── */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 18, flexWrap: 'wrap' }}>
        <select className="inp" value={selRoutine}  onChange={e => setSelRoutine(e.target.value)}  style={{ flex: '1 1 140px' }}>
          {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select className="inp" value={selExercise} onChange={e => setSelExercise(e.target.value)} style={{ flex: '1 1 140px' }}>
          {exerciseNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {pts.length < 2 ? (
        <div className="card" style={{ padding: '52px 20px', textAlign: 'center' }}>
          <div className="fd" style={{ fontSize: 36, color: '#2a2a2a', marginBottom: 8 }}>NOT ENOUGH DATA</div>
          <p style={{ fontSize: 12, color: '#383838' }}>Log this exercise at least twice to chart progress</p>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 9, marginBottom: 14 }}>
            {[
              { label: 'SESSIONS', value: pts.length },
              { label: 'CURRENT',  value: `${pts[pts.length - 1].w}${pts[0].u}` },
              { label: 'STARTED',  value: `${pts[0].w}${pts[0].u}` },
              { label: 'PROGRESS', value: `${progress >= 0 ? '+' : ''}${progress}kg`, accent: progress > 0 },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#444', letterSpacing: '.09em', marginBottom: 3 }}>{s.label}</div>
                <div className="fd" style={{ fontSize: 22, color: s.accent ? '#c8ff00' : '#f0f0f0' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── SVG Chart ── */}
          <div className="card" style={{ padding: '18px', overflowX: 'auto' }}>
            <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 10 }}>
              {selExercise} · Weight Over Time
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 280 }}>
              {/* Grid lines + Y labels */}
              {[0, .25, .5, .75, 1].map(t => {
                const y = PAD.t + cH * (1 - t)
                return (
                  <g key={t}>
                    <line x1={PAD.l} x2={PAD.l + cW} y1={y} y2={y} stroke="#1e1e1e" strokeWidth={1} />
                    <text x={PAD.l - 5} y={y + 4} textAnchor="end" fill="#383838" fontSize={9} fontFamily="IBM Plex Mono">
                      {(minW + t * rng).toFixed(0)}
                    </text>
                  </g>
                )
              })}

              {/* X-axis date labels (thinned for dense datasets) */}
              {pts.map((d, i) => {
                if (pts.length > 7 && i % Math.ceil(pts.length / 7) !== 0 && i !== pts.length - 1) return null
                return (
                  <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fill="#383838" fontSize={8} fontFamily="IBM Plex Mono">
                    {d.date.slice(5)}
                  </text>
                )
              })}

              {/* Area fill */}
              <path d={areaPath} fill="#c8ff00" fillOpacity={.06} />

              {/* Line */}
              <path d={linePath} fill="none" stroke="#c8ff00" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

              {/* Data points */}
              {pts.map((d, i) => (
                <g key={i}>
                  <circle cx={toX(i)} cy={toY(d.w)} r={4}  fill="#c8ff00" />
                  <circle cx={toX(i)} cy={toY(d.w)} r={9}  fill="#c8ff00" fillOpacity={.12} />
                  <text x={toX(i)} y={toY(d.w) - 12} textAnchor="middle" fill="#c8ff00" fontSize={9} fontFamily="IBM Plex Mono" fontWeight="500">
                    {d.w}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
