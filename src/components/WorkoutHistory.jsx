import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { fmtDate } from '../utils/helpers'

/**
 * WorkoutHistory
 * Renders all past workout logs, with filters for routine name and start date.
 * Props:
 *   logs        — array of log entry objects
 *   onDeleteLog — called with log.id to remove an entry
 */
export default function WorkoutHistory({ logs, onDeleteLog }) {
  const [routineFilter, setRoutineFilter] = useState('all')
  const [dateFilter,    setDateFilter]    = useState('')

  // Unique routine names for filter dropdown
  const routineNames = useMemo(() => [...new Set(logs.map(l => l.routineName))], [logs])

  // Filter and sort newest-first
  const filtered = useMemo(() =>
    logs
      .filter(l =>
        (routineFilter === 'all' || l.routineName === routineFilter) &&
        (!dateFilter || l.date >= dateFilter)
      )
      .sort((a, b) => b.date.localeCompare(a.date)),
    [logs, routineFilter, dateFilter]
  )

  return (
    <div>
      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 18, flexWrap: 'wrap' }}>
        <select
          className="inp" value={routineFilter}
          onChange={e => setRoutineFilter(e.target.value)}
          style={{ flex: '1 1 140px', maxWidth: 200 }}
        >
          <option value="all">All Routines</option>
          {routineNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: '1 1 160px' }}>
          <span style={{ fontSize: 11, color: '#444', whiteSpace: 'nowrap' }}>From:</span>
          <input
            className="inp" type="date" value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {dateFilter && (
          <button type="button" className="btn-g" onClick={() => setDateFilter('')} style={{ padding: '7px 12px', fontSize: 12 }}>
            Clear
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="fd" style={{ fontSize: 42, color: '#1e1e1e', marginBottom: 8 }}>NO LOGS FOUND</div>
          <p style={{ fontSize: 13, color: '#444' }}>Log workouts from the dashboard to see history here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {filtered.map((log, idx) => {
            const done   = log.exercises.filter(e => e.completed).length
            const total  = log.exercises.length
            const volume = log.exercises
              .filter(e => e.completed)
              .reduce((s, e) => s + e.sets * e.reps * e.weight, 0)

            return (
              <motion.div
                key={log.id}
                className="card"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
              >
                <div style={{ padding: '15px 19px' }}>
                  {/* Log header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                        <h3 className="fd" style={{ fontSize: 19 }}>{log.routineName}</h3>
                        <span className="tag">{done}/{total} done</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className="fm" style={{ fontSize: 11, color: '#c8ff00' }}>{fmtDate(log.date)}</span>
                        {volume > 0 && <span className="pill">{volume.toLocaleString()}kg vol</span>}
                      </div>
                    </div>
                    <button type="button" className="btn-d" onClick={() => onDeleteLog(log.id)} style={{ padding: '5px 9px', fontSize: 12 }} aria-label="Delete log">✕</button>
                  </div>

                  {/* Completion bar */}
                  <div className="pb-track" style={{ marginBottom: 9 }}>
                    <div className="pb-fill" style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} />
                  </div>

                  {/* Exercise chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {log.exercises.map(ex => (
                      <span
                        key={ex.id}
                        style={{
                          fontSize: 10, padding: '3px 7px', borderRadius: 6,
                          background:     ex.completed ? 'rgba(200,255,0,.07)' : '#161616',
                          color:          ex.completed ? '#c8ff00'             : '#333',
                          border:        `1px solid ${ex.completed ? 'rgba(200,255,0,.15)' : '#1c1c1c'}`,
                          fontFamily:    'IBM Plex Mono',
                          textDecoration: ex.completed ? 'none' : 'line-through',
                        }}
                      >
                        {ex.name}{ex.weight > 0 ? ` ${ex.weight}${ex.unit}` : ''}
                      </span>
                    ))}
                  </div>

                  {/* Notes */}
                  {log.notes && (
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: '#555', fontStyle: 'italic', borderTop: '1px solid #1a1a1a', paddingTop: 9 }}>
                      "{log.notes}"
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
