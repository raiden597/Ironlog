/**
 * Seed data — loaded only when localStorage is empty on first visit.
 * Demonstrates progressive overload across 8 sessions.
 */

export const SEED_ROUTINES = [
  {
    id: 'r1', name: 'PUSH DAY', description: 'Chest · Shoulders · Triceps',
    exercises: [
      { id: 'e1', name: 'Bench Press',     sets: 4, reps: 8,  weight: 80,  unit: 'kg' },
      { id: 'e2', name: 'Overhead Press',  sets: 3, reps: 10, weight: 50,  unit: 'kg' },
      { id: 'e3', name: 'Cable Flyes',     sets: 3, reps: 12, weight: 25,  unit: 'kg' },
      { id: 'e4', name: 'Tricep Pushdown', sets: 3, reps: 15, weight: 30,  unit: 'kg' },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: 'r2', name: 'PULL DAY', description: 'Back · Biceps · Rear Delts',
    exercises: [
      { id: 'e5', name: 'Deadlift',     sets: 4, reps: 5,  weight: 120, unit: 'kg' },
      { id: 'e6', name: 'Pull-ups',     sets: 3, reps: 8,  weight: 0,   unit: 'kg' },
      { id: 'e7', name: 'Barbell Row',  sets: 3, reps: 10, weight: 70,  unit: 'kg' },
      { id: 'e8', name: 'Hammer Curls', sets: 3, reps: 12, weight: 16,  unit: 'kg' },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: 'r3', name: 'LEG DAY', description: 'Quads · Hamstrings · Glutes',
    exercises: [
      { id: 'e9',  name: 'Back Squat',  sets: 5, reps: 5,  weight: 100, unit: 'kg' },
      { id: 'e10', name: 'Romanian DL', sets: 3, reps: 10, weight: 80,  unit: 'kg' },
      { id: 'e11', name: 'Leg Press',   sets: 3, reps: 12, weight: 160, unit: 'kg' },
    ],
    createdAt: '2024-01-11',
  },
]

// Helper — mark all exercises completed, optionally bump weight
const mkLog = (id, routineIdx, date, weightOffset, notes) => {
  const r = SEED_ROUTINES[routineIdx]
  return {
    id,
    routineId:   r.id,
    routineName: r.name,
    date,
    notes,
    exercises: r.exercises.map(e => ({
      ...e,
      weight:    e.weight + weightOffset,
      completed: true,
    })),
  }
}

export const SEED_LOGS = [
  mkLog('l1', 0, '2024-03-01', 0,   'Solid session'),
  mkLog('l2', 1, '2024-03-03', 0,   ''),
  mkLog('l3', 0, '2024-03-06', 2.5, '+2.5kg bench!'),
  mkLog('l4', 2, '2024-03-08', 0,   'Legs are toast'),
  mkLog('l5', 1, '2024-03-11', 5,   'New deadlift PR!'),
  mkLog('l6', 0, '2024-03-13', 5,   'Crushed it'),
  mkLog('l7', 2, '2024-03-15', 5,   ''),
  mkLog('l8', 0, '2024-03-18', 7.5, 'Bench PR!!'),
]
