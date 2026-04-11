import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * WorkoutCard
 * Displays a single routine on the dashboard.
 * Collapsible to show exercise list.
 * Props:
 *   routine     — routine object
 *   onEdit      — called with routine to open edit form
 *   onDelete    — called with routine.id to delete
 *   onLog       — called with routine to open log modal
 *   onDuplicate — called with routine to clone it
 *   idx         — for staggered entrance animation
 */
export default function WorkoutCard({ routine, onEdit, onDelete, onLog, onDuplicate, idx }) {
  const [expanded, setExpanded] = useState(false)

  const totalSets   = routine.exercises.reduce((s, e) => s + e.sets,  0)
  const totalVolume = routine.exercises.reduce((s, e) => s + e.sets * e.reps * e.weight, 0)

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.25 }}
      style={{ overflow: 'hidden' }}
    >
      {/* ── Clickable header ── */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${routine.name}, ${expanded ? 'collapse' : 'expand'} exercise list`}
        style={{ padding: '17px 19px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded(x => !x)
          }
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="fd" style={{ fontSize: 21, lineHeight: 1, marginBottom: 3 }}>{routine.name}</h3>
          {routine.description && (
            <p style={{ fontSize: 11, color: '#555', margin: 0 }}>{routine.description}</p>
          )}
          <div style={{ display: 'flex', gap: 5, marginTop: 9, flexWrap: 'wrap' }}>
            <span className="pill">{routine.exercises.length} exercises</span>
            <span className="pill">{totalSets} sets</span>
            {totalVolume > 0 && <span className="pill">{totalVolume.toLocaleString()}kg vol</span>}
          </div>
        </div>
        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#383838', fontSize: 16, flexShrink: 0, marginTop: 4, display: 'block' }}
        >
          ▾
        </motion.span>
      </div>

      {/* ── Exercise list (animated expand/collapse) ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 19px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {routine.exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#0a0a0a', borderRadius: 7, padding: '7px 11px' }}
                >
                  <span className="fm" style={{ fontSize: 10, color: '#333', width: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{ex.name || '—'}</span>
                  <span className="fm" style={{ fontSize: 11, color: '#666' }}>{ex.sets}×{ex.reps}</span>
                  {ex.weight > 0 && <span className="tag">{ex.weight}{ex.unit}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action bar ── */}
      <div style={{ padding: '11px 19px', borderTop: '1px solid #191919', display: 'flex', gap: 7, background: '#0c0c0c' }}>
        <button type="button" className="btn-p" onClick={() => onLog(routine)}       style={{ flex: 1, padding: '7px 10px', fontSize: 12 }}>▶ LOG</button>
        <button type="button" className="btn-g" onClick={() => onEdit(routine)}      style={{ padding: '7px 11px', fontSize: 13 }} title="Edit">✏</button>
        <button type="button" className="btn-g" onClick={() => onDuplicate(routine)} style={{ padding: '7px 11px', fontSize: 13 }} title="Duplicate">⧉</button>
        <button type="button" className="btn-d" onClick={() => onDelete(routine.id)} style={{ padding: '7px 11px', fontSize: 13 }} title="Delete">🗑</button>
      </div>
    </motion.div>
  )
}
