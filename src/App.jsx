import { useState, useEffect, useMemo, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

import WorkoutCard    from './components/WorkoutCard'
import WorkoutForm    from './components/WorkoutForm'
import LogModal       from './components/LogModal'
import WorkoutHistory from './components/WorkoutHistory'
import ProgressChart  from './components/ProgressChart'

import { lsGet, lsSet }            from './utils/storage'
import { uid, todayStr }           from './utils/helpers'
import { SEED_ROUTINES, SEED_LOGS } from './data/seed'

/**
 * App — root component.
 * Owns all global state (routines + logs) and persists it to localStorage.
 * Renders the header, stats bar, and the active view.
 */
export default function App() {
  // ── State — seeded from localStorage on first load ──
  const [routines, setRoutines] = useState(() => lsGet('il_routines', SEED_ROUTINES))
  const [logs,     setLogs]     = useState(() => lsGet('il_logs',     SEED_LOGS))

  // ── View state ──
  const [view,     setView]     = useState('dashboard') // 'dashboard' | 'history' | 'progress'
  const [showForm, setShowForm] = useState(false)
  const [editR,    setEditR]    = useState(null)  // routine being edited (null = new)
  const [logR,     setLogR]     = useState(null)  // routine being logged

  // ── Persist to localStorage on every change ──
  useEffect(() => lsSet('il_routines', routines), [routines])
  useEffect(() => lsSet('il_logs',     logs),     [logs])

  // ── Routine handlers ──
  const saveRoutine = useCallback(r => {
    setRoutines(rs => rs.some(x => x.id === r.id) ? rs.map(x => x.id === r.id ? r : x) : [r, ...rs])
    setShowForm(false)
    setEditR(null)
  }, [])

  const deleteRoutine = useCallback(id => {
    if (!window.confirm('Delete this routine? This cannot be undone.')) return
    setRoutines(rs => rs.filter(r => r.id !== id))
  }, [])

  const duplicateRoutine = useCallback(r => {
    setRoutines(rs => [{
      ...r,
      id:        uid(),
      name:      r.name + ' (COPY)',
      exercises: r.exercises.map(e => ({ ...e, id: uid() })),
      createdAt: todayStr(),
    }, ...rs])
  }, [])

  // ── Log handlers ──
  const saveLog   = useCallback(l => { setLogs(ls => [l, ...ls]); setLogR(null) }, [])
  const deleteLog = useCallback(id => setLogs(ls => ls.filter(l => l.id !== id)), [])

  // ── Dashboard stats ──
  const stats = useMemo(() => {
    const now     = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return {
      routines: routines.length,
      sessions: logs.length,
      thisWeek: logs.filter(l => new Date(l.date + 'T12:00:00') >= weekAgo).length,
      volume:   logs.reduce((sum, l) =>
        sum + l.exercises.filter(e => e.completed).reduce((s, e) => s + e.sets * e.reps * e.weight, 0), 0
      ),
    }
  }, [routines, logs])

  return (
    <div style={{ minHeight: '100vh', background: '#080808' }}>

      {/* ════ MODALS ════ */}
      <AnimatePresence>
        {showForm && (
          <WorkoutForm
            key="form"
            routine={editR}
            onSave={saveRoutine}
            onCancel={() => { setShowForm(false); setEditR(null) }}
          />
        )}
        {logR && (
          <LogModal
            key="log"
            routine={logR}
            onSave={saveLog}
            onClose={() => setLogR(null)}
          />
        )}
      </AnimatePresence>

      {/* ════ HEADER ════ */}
      <header style={{ borderBottom: '1px solid #141414', background: 'rgba(8,8,8,.95)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 18px', display: 'flex', alignItems: 'center', gap: 12, height: 56 }}>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 6 }}>
            <div style={{ width: 6, height: 26, background: '#c8ff00', borderRadius: 2 }} />
            <span className="fd" style={{ fontSize: 22, lineHeight: 1 }}>
              IRON<span style={{ color: '#c8ff00' }}>LOG</span>
            </span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: 1 }}>
            {[['dashboard', 'Routines'], ['history', 'History'], ['progress', 'Progress']].map(([id, label]) => (
              <button
                key={id}
                className={`nav-btn${view === id ? ' active' : ''}`}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* New Routine — only shown on dashboard */}
          {view === 'dashboard' && (
            <button
              className="btn-p"
              onClick={() => { setEditR(null); setShowForm(true) }}
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              + NEW
            </button>
          )}
        </div>
      </header>

      {/* ════ MAIN ════ */}
      <main style={{ maxWidth: 1060, margin: '0 auto', padding: '18px 18px 60px' }}>

        {/* ── Stats bar ── */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 22, flexWrap: 'wrap' }}>
          {[
            ['ROUTINES',  stats.routines],
            ['SESSIONS',  stats.sessions],
            ['THIS WEEK', stats.thisWeek],
            ['TOTAL VOL', stats.volume > 0 ? `${(stats.volume / 1000).toFixed(1)}t` : '—'],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{ flex: '1 1 80px', background: '#0e0e0e', border: '1px solid #191919', borderRadius: 9, padding: '11px 14px' }}
            >
              <div style={{ fontSize: 9, color: '#3a3a3a', letterSpacing: '.1em', marginBottom: 3 }}>{label}</div>
              <div className="fd" style={{ fontSize: 24, lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── VIEW: DASHBOARD ── */}
        {view === 'dashboard' && (
          <div>
            <div style={{ fontSize: 11, color: '#3a3a3a', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Your Routines · {routines.length}
            </div>

            {routines.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className="fd" style={{ fontSize: 52, color: '#1c1c1c', marginBottom: 10 }}>NO ROUTINES YET</div>
                <p style={{ fontSize: 13, color: '#3a3a3a', marginBottom: 20 }}>Create your first workout routine to begin tracking</p>
                <button className="btn-p" onClick={() => setShowForm(true)}>+ CREATE ROUTINE</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
                {routines.map((r, i) => (
                  <WorkoutCard
                    key={r.id}
                    routine={r}
                    idx={i}
                    onEdit={r => { setEditR(r); setShowForm(true) }}
                    onDelete={deleteRoutine}
                    onLog={setLogR}
                    onDuplicate={duplicateRoutine}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── VIEW: HISTORY ── */}
        {view === 'history' && (
          <div>
            <div style={{ fontSize: 11, color: '#3a3a3a', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Workout History · {logs.length} sessions
            </div>
            <WorkoutHistory logs={logs} onDeleteLog={deleteLog} />
          </div>
        )}

        {/* ── VIEW: PROGRESS ── */}
        {view === 'progress' && (
          <div>
            <div style={{ fontSize: 11, color: '#3a3a3a', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Progress Tracking
            </div>
            {routines.length === 0 || logs.length < 2 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className="fd" style={{ fontSize: 42, color: '#1c1c1c', marginBottom: 8 }}>LOG MORE SESSIONS</div>
                <p style={{ fontSize: 12, color: '#3a3a3a' }}>Log the same exercise at least twice to chart progress</p>
              </div>
            ) : (
              <ProgressChart logs={logs} routines={routines} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
