import { motion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * ExerciseItem
 * A single editable exercise row inside WorkoutForm.
 * Props:
 *   ex       — exercise object { id, name, sets, reps, weight, unit }
 *   onChange — called with updated exercise object on any field change
 *   onDelete — called when the remove button is clicked
 *   idx      — index in list (used for staggered entrance animation)
 */
export default function ExerciseItem({ ex, onChange, onDelete, idx }) {
  const upd = (field, val) => onChange({ ...ex, [field]: val })

  return (
    <motion.div
      className="ex-row"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: idx * 0.04, duration: 0.2 }}
    >
      {/* Name */}
      <input
        className="inp"
        placeholder="Exercise name"
        value={ex.name}
        onChange={e => upd('name', e.target.value)}
        style={{ flex: 2, fontSize: 12 }}
      />
      {/* Sets */}
      <input
        className="inp fm"
        type="number" min={1} placeholder="Sets"
        value={ex.sets}
        onChange={e => upd('sets', +e.target.value)}
        style={{ flex: '0 0 52px', textAlign: 'center', fontSize: 12 }}
      />
      {/* Reps */}
      <input
        className="inp fm"
        type="number" min={1} placeholder="Reps"
        value={ex.reps}
        onChange={e => upd('reps', +e.target.value)}
        style={{ flex: '0 0 52px', textAlign: 'center', fontSize: 12 }}
      />
      {/* Weight */}
      <input
        className="inp fm"
        type="number" min={0} step={0.5} placeholder="Wt"
        value={ex.weight}
        onChange={e => upd('weight', +e.target.value)}
        style={{ flex: '0 0 64px', textAlign: 'center', fontSize: 12 }}
      />
      {/* Unit */}
      <select
        className="inp"
        value={ex.unit}
        onChange={e => upd('unit', e.target.value)}
        style={{ flex: '0 0 56px', fontSize: 11, padding: '9px 4px' }}
      >
        <option>kg</option>
        <option>lbs</option>
      </select>
      {/* Remove */}
      <button type="button" className="btn-d" onClick={onDelete} style={{ padding: '6px 9px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Remove exercise">
        <X size={14} strokeWidth={2} />
      </button>
    </motion.div>
  )
}
