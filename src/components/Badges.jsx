import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getUnlockedBadges, getCurrentStreak, getMaxStreak } from '../utils/badges'

export default function Badges({ logs }) {
  const badges  = useMemo(() => getUnlockedBadges(logs), [logs])
  const current = getCurrentStreak(logs)
  const max     = getMaxStreak(logs)
  const earned  = badges.filter(b => b.unlocked).length

  return (
    <div>
      {/* ── Streak + summary stats ── */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { label: 'EARNED',       value: `${earned}/${badges.length}` },
          { label: 'CURRENT STREAK', value: `${current}d` },
          { label: 'BEST STREAK',  value: `${max}d` },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 80px', background: '#0e0e0e', border: '1px solid #191919', borderRadius: 9, padding: '11px 14px' }}>
            <div style={{ fontSize: 9, color: '#3a3a3a', letterSpacing: '.1em', marginBottom: 3 }}>{s.label}</div>
            <div className="fd" style={{ fontSize: 24, lineHeight: 1, color: s.label === 'CURRENT STREAK' && current > 0 ? '#c8ff00' : '#f0f0f0' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Badge grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {badges.map((b, i) => (
          <motion.div
            key={b.id}
            className="card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            style={{
              padding: '16px 14px',
              textAlign: 'center',
              opacity: b.unlocked ? 1 : 0.35,
              border: b.unlocked ? '1px solid rgba(200,255,0,0.2)' : '1px solid #1e1e1e',
              transition: 'all .2s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle lime glow on unlocked cards */}
            {b.unlocked && (
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(200,255,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            )}
            <div style={{ fontSize: 32, marginBottom: 8, filter: b.unlocked ? 'none' : 'grayscale(1)' }}>
              {b.emoji}
            </div>
            <div className="fd" style={{ fontSize: 14, marginBottom: 4, color: b.unlocked ? '#c8ff00' : '#555' }}>
              {b.name}
            </div>
            <div style={{ fontSize: 10, color: '#444', fontFamily: 'IBM Plex Mono', lineHeight: 1.4 }}>
              {b.desc}
            </div>
            {b.unlocked && (
              <div style={{ marginTop: 8, fontSize: 9, color: '#c8ff00', fontFamily: 'IBM Plex Mono', letterSpacing: '.08em' }}>
                UNLOCKED
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}