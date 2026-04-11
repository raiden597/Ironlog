import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ExerciseItem from './ExerciseItem'
import { uid, todayStr } from '../utils/helpers'

/**
 * WorkoutForm
 * Modal for creating a new routine or editing an existing one.
 * Props:
 *   routine  — existing routine object to edit, or null for creation
 *   onSave   — called with the saved routine object
 *   onCancel — called when the modal is dismissed
 */
export default function WorkoutForm({ routine, onSave, onCancel }) {
  const [name, setName] = useState(routine?.name ?? '')
  const [desc, setDesc] = useState(routine?.description ?? '')
  const [exs,  setExs]  = useState(
    routine?.exercises ?? [{ id: uid(), name: '', sets: 3, reps: 10, weight: 0, unit: 'kg' }]
  )

  const addExercise    = () => setExs(e => [...e, { id: uid(), name: '', sets: 3, reps: 10, weight: 0, unit: 'kg' }])
  const updateExercise = (id, d) => setExs(e => e.map(x => x.id === id ? d : x))
  const deleteExercise = id => setExs(e => e.filter(x => x.id !== id))

  const handleSave = () => {
    if (!name.trim()) return alert('Routine name is required.')
    onSave({
      id:          routine?.id ?? uid(),
      name:        name.trim().toUpperCase(),
      description: desc.trim(),
      exercises:   exs.filter(e => e.name.trim()),
      createdAt:   routine?.createdAt ?? todayStr(),
    })
  }

  return (
    <motion.div
      className="modal-overlay"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-form-title"
        initial={{ opacity: 0, y: 16, scale: .97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: .97 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 580 }}
      >
        {/* Header */}
        <div style={{ padding: '22px 22px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 id="routine-form-title" className="fd" style={{ fontSize: 26, color: '#c8ff00' }}>
              {routine ? 'EDIT ROUTINE' : 'NEW ROUTINE'}
            </h2>
            <button type="button" className="btn-g" onClick={onCancel} style={{ padding: '5px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Name field */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 5 }}>Workout Name</div>
            <input className="inp" placeholder="e.g. PUSH DAY" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Description field */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 5 }}>Description</div>
            <input className="inp" placeholder="e.g. Chest · Shoulders · Triceps" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          {/* Column headers */}
          <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#333', fontFamily: 'IBM Plex Mono', marginBottom: 6, paddingLeft: 4 }}>
            <span style={{ flex: 2 }}>NAME</span>
            <span style={{ flex: '0 0 52px', textAlign: 'center' }}>SETS</span>
            <span style={{ flex: '0 0 52px', textAlign: 'center' }}>REPS</span>
            <span style={{ flex: '0 0 64px', textAlign: 'center' }}>WEIGHT</span>
            <span style={{ flex: '0 0 56px', textAlign: 'center' }}>UNIT</span>
            <span style={{ width: 38 }} />
          </div>
        </div>

        {/* Exercise list */}
        <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 7, maxHeight: '38vh', overflowY: 'auto' }}>
          <AnimatePresence>
            {exs.map((ex, i) => (
              <ExerciseItem
                key={ex.id}
                ex={ex}
                idx={i}
                onChange={d => updateExercise(ex.id, d)}
                onDelete={() => deleteExercise(ex.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            className="btn-g"
            onClick={addExercise}
            style={{ width: '100%', padding: 9, borderStyle: 'dashed', color: '#c8ff00', borderColor: 'rgba(200,255,0,.17)', fontSize: 12 }}
          >
            + ADD EXERCISE
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-g" onClick={onCancel} style={{ flex: 1 }}>CANCEL</button>
            <button type="button" className="btn-p" onClick={handleSave} style={{ flex: 2 }}>
              {routine ? 'SAVE CHANGES' : 'CREATE ROUTINE'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
