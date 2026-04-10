// Badge definitions and unlock logic.
// Each badge has an id, name, emoji, description, and a check(logs) function.

export const BADGES = [
  {
    id: 'first_rep',
    name: 'First Rep',
    emoji: '🏁',
    desc: 'Log your first session',
    check: (logs) => logs.length >= 1,
  },
  {
    id: 'hat_trick',
    name: 'Hat Trick',
    emoji: '🎩',
    desc: 'Log 3 sessions',
    check: (logs) => logs.length >= 3,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    emoji: '⚔️',
    desc: 'Log 7 sessions',
    check: (logs) => logs.length >= 7,
  },
  {
    id: 'month_strong',
    name: 'Month Strong',
    emoji: '📅',
    desc: 'Log 30 sessions',
    check: (logs) => logs.length >= 30,
  },
  {
    id: 'century',
    name: 'Century',
    emoji: '💯',
    desc: 'Log 100 sessions',
    check: (logs) => logs.length >= 100,
  },
  {
    id: 'iron_streak',
    name: 'Iron Streak',
    emoji: '🔥',
    desc: '7 days in a row',
    check: (logs) => getMaxStreak(logs) >= 7,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    emoji: '⚡',
    desc: '14 days in a row',
    check: (logs) => getMaxStreak(logs) >= 14,
  },
  {
    id: 'full_house',
    name: 'Full House',
    emoji: '✅',
    desc: 'Complete every exercise in a session',
    check: (logs) => logs.some(l => l.exercises.length > 0 && l.exercises.every(e => e.completed)),
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    emoji: '🎯',
    desc: '5 sessions in one week',
    check: (logs) => getMaxSessionsInWeek(logs) >= 5,
  },
  {
    id: 'volume_club',
    name: 'Volume Club',
    emoji: '🏋️',
    desc: 'Lift 10,000kg total',
    check: (logs) => getTotalVolume(logs) >= 10000,
  },
  {
    id: 'tonnage',
    name: 'Tonnage',
    emoji: '🏔️',
    desc: 'Lift 100,000kg total',
    check: (logs) => getTotalVolume(logs) >= 100000,
  },
  {
    id: 'pr_hunter',
    name: 'PR Hunter',
    emoji: '🎖️',
    desc: 'Set a new weight PR on any exercise',
    check: (logs) => hasPR(logs),
  },
  {
    id: 'push_master',
    name: 'Push Master',
    emoji: '💪',
    desc: 'Log a push day 10 times',
    check: (logs) => logs.filter(l => l.routineName.toUpperCase().includes('PUSH')).length >= 10,
  },
  {
    id: 'pull_master',
    name: 'Pull Master',
    emoji: '🦾',
    desc: 'Log a pull day 10 times',
    check: (logs) => logs.filter(l => l.routineName.toUpperCase().includes('PULL')).length >= 10,
  },
  {
    id: 'leg_day_hero',
    name: 'Leg Day Hero',
    emoji: '🦵',
    desc: 'Log a leg day 10 times',
    check: (logs) => logs.filter(l => l.routineName.toUpperCase().includes('LEG')).length >= 10,
  },
]

// Returns which badges are unlocked given the current logs
export const getUnlockedBadges = (logs) =>
  BADGES.map(b => ({ ...b, unlocked: b.check(logs) }))

// ── Helpers ──────────────────────────────────────────────────

// Total volume across all completed exercises
const getTotalVolume = (logs) =>
  logs.reduce((sum, l) =>
    sum + l.exercises.filter(e => e.completed).reduce((s, e) => s + e.sets * e.reps * e.weight, 0), 0
  )

// Longest consecutive training day streak (by calendar date)
export const getMaxStreak = (logs) => {
  if (!logs.length) return 0
  const days = [...new Set(logs.map(l => l.date))].sort()
  let max = 1, cur = 1
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000
    cur = diff === 1 ? cur + 1 : 1
    if (cur > max) max = cur
  }
  return max
}

// Current active streak (days in a row up to today)
export const getCurrentStreak = (logs) => {
  if (!logs.length) return 0
  const days = [...new Set(logs.map(l => l.date))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  // Streak must include today or yesterday to be active
  if (days[0] !== today && days[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

// Max sessions logged in any single calendar week (Mon–Sun)
const getMaxSessionsInWeek = (logs) => {
  const weekMap = {}
  logs.forEach(l => {
    const d = new Date(l.date + 'T12:00:00')
    const day = d.getDay() // 0=Sun
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((day + 6) % 7))
    const key = monday.toISOString().split('T')[0]
    weekMap[key] = (weekMap[key] ?? 0) + 1
  })
  return Math.max(0, ...Object.values(weekMap))
}

// True if any exercise has been logged at a higher weight than its first log
const hasPR = (logs) => {
  const bests = {}
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  for (const log of sorted) {
    for (const ex of log.exercises) {
      if (!ex.completed || ex.weight === 0) continue
      if (bests[ex.name] === undefined) { bests[ex.name] = ex.weight; continue }
      if (ex.weight > bests[ex.name]) return true
      bests[ex.name] = Math.max(bests[ex.name], ex.weight)
    }
  }
  return false
}