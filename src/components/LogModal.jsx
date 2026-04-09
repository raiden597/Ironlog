import { useState } from 'react'
import { motion } from 'framer-motion'
import { uid, todayStr } from '../utils/helpers'

/**
 * LogModal
 * Modal to record a completed workout session.
 * Users can adjust actual weights and uncheck any skipped exercises.
 * Props:
 *   routine — the routine being logged
 *   onSave  — called with the new log entry object
 *   onClose — called to dismiss the modal
 */
export default function LogModal({ routine, onSave, onClose }) {
  const [date,  setDate]  = useState(todayStr())
  const [notes, setNotes] = useState('')
  // Start with all exercises checked and pre-filled weights
  const [exs, setExs] = useState(routine.exercises.map(e => ({ ...e, completed: true })))

  const toggle = id => setExs(e => e.map(x => x.id === id ? { ...x, completed: !x.completed } : x))
  const updW   = (id, w) => setExs(e => e.map(x => x.id === id ? { ...x, weight: +w } : x))

  const handleSave = () => {
    onSave({
      id:          uid(),
      routineId:   routine.id,
      routineName: routine.name,
      date,
      exercises:   exs,
      notes:       notes.trim(),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: .97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: .97 }}
        transition={{ duration: 0.22 }}
        style={{ background: '#111', border: '1px solid #222', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ padding: 22 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <h2 className="fd" style={{ fontSize: 26, color: '#c8ff00' }}>LOG WORKOUT</h2>
              <p style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{routine.name} · {routine.description}</p>
            </div>
            <button className="btn-g" onClick={onClose} style={{ padding: '5px 10px' }}>✕</button>
          </div>

          {/* Date */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 5 }}>Date</div>
            <input className="inp" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
          </div>

          {/* Exercise checklist */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 8 }}>
              Check completed · adjust weights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {exs.map(ex => (
                <div
                  key={ex.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background:  ex.completed ? '#141414' : '#0c0c0c',
                    border:     `1px solid ${ex.completed ? '#242424' : '#181818'}`,
                    borderRadius: 9, padding: '9px 13px',
                    opacity: ex.completed ? 1 : .45,
                    transition: 'all .15s',
                  }}
                >
                  <input type="checkbox" checked={ex.completed} onChange={() => toggle(ex.id)} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{ex.name}</span>
                  <span className="fm" style={{ fontSize: 11, color: '#555' }}>{ex.sets}×{ex.reps}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <input
                      className="inp fm" type="number" step={0.5}
                      value={ex.weight} onChange={e => updW(ex.id, e.target.value)}
                      style={{ width: 64, textAlign: 'center', fontSize: 12 }}
                    />
                    <span style={{ fontSize: 10, color: '#444', flexShrink: 0 }}>{ex.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 5 }}>Session Notes</div>
            <textarea
              className="inp" placeholder="How did it go?"
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={2} style={{ resize: 'none', lineHeight: 1.5 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-g" onClick={onClose} style={{ flex: 1 }}>CANCEL</button>
            <button className="btn-p" onClick={handleSave} style={{ flex: 2 }}>✓ SAVE LOG</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
