/**
 * Seed data — loaded only when localStorage is empty on first visit.
 * 5-day Push / Pull / Legs / Upper / Legs program, weights start at 0.
 */

export const SEED_ROUTINES = [
  {
    id: 'r1',
    name: 'DAY 1 — PUSH',
    description: 'Chest · Shoulders · Triceps',
    createdAt: '2025-01-01',
    exercises: [
      { id: 'e1',  name: 'Flat Barbell Bench Press',         sets: 4, reps: 7,  weight: 0, unit: 'kg' },
      { id: 'e2',  name: 'Incline Dumbbell Press',           sets: 3, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e3',  name: 'Overhead Dumbbell Shoulder Press', sets: 4, reps: 10, weight: 0, unit: 'kg' },
      { id: 'e4',  name: 'Cable Chest Flys',                 sets: 3, reps: 13, weight: 0, unit: 'kg' },
      { id: 'e5',  name: 'Lateral Raises',                   sets: 3, reps: 13, weight: 0, unit: 'kg' },
      { id: 'e6',  name: 'Tricep Dips',                      sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e7',  name: 'Rope Tricep Pushdowns',            sets: 3, reps: 13, weight: 0, unit: 'kg' },
    ],
  },
  {
    id: 'r2',
    name: 'DAY 2 — PULL',
    description: 'Back · Biceps · Rear Delts',
    createdAt: '2025-01-01',
    exercises: [
      { id: 'e8',  name: 'Deadlifts',         sets: 4, reps: 5,  weight: 0, unit: 'kg' },
      { id: 'e9',  name: 'Pull-Ups',          sets: 4, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e10', name: 'Barbell Rows',      sets: 3, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e11', name: 'Seated Cable Rows', sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e12', name: 'Face Pulls',        sets: 3, reps: 13, weight: 0, unit: 'kg' },
      { id: 'e13', name: 'Barbell Curls',     sets: 4, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e14', name: 'Hammer Curls',      sets: 3, reps: 11, weight: 0, unit: 'kg' },
    ],
  },
  {
    id: 'r3',
    name: 'DAY 3 — LEGS',
    description: 'Quads · Hamstrings · Glutes',
    createdAt: '2025-01-01',
    exercises: [
      { id: 'e15', name: 'Back Squats',        sets: 4, reps: 7,  weight: 0, unit: 'kg' },
      { id: 'e16', name: 'Romanian Deadlifts', sets: 3, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e17', name: 'Leg Press',          sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e18', name: 'Walking Lunges',     sets: 3, reps: 12, weight: 0, unit: 'kg' },
      { id: 'e19', name: 'Leg Curls',          sets: 3, reps: 13, weight: 0, unit: 'kg' },
      { id: 'e20', name: 'Calf Raises',        sets: 4, reps: 17, weight: 0, unit: 'kg' },
    ],
  },
  {
    id: 'r4',
    name: 'DAY 4 — UPPER',
    description: 'Strength & Volume',
    createdAt: '2025-01-01',
    exercises: [
      { id: 'e21', name: 'Overhead Barbell Press',    sets: 4, reps: 7,  weight: 0, unit: 'kg' },
      { id: 'e22', name: 'Weighted Dips',             sets: 3, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e23', name: 'T-Bar Rows',                sets: 4, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e24', name: 'Incline Bench Cable Flys',  sets: 3, reps: 13, weight: 0, unit: 'kg' },
      { id: 'e25', name: 'Lat Pulldowns (Wide Grip)', sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e26', name: 'EZ-Bar Skull Crushers',     sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e27', name: 'Plank',                     sets: 3, reps: 60, weight: 0, unit: 'kg' },
    ],
  },
  {
    id: 'r5',
    name: 'DAY 5 — LEGS',
    description: 'Hypertrophy & Endurance',
    createdAt: '2025-01-01',
    exercises: [
      { id: 'e28', name: 'Front Squats',           sets: 4, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e29', name: 'Bulgarian Split Squats', sets: 3, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e30', name: 'Hip Thrusts',            sets: 4, reps: 11, weight: 0, unit: 'kg' },
      { id: 'e31', name: 'Leg Extensions',         sets: 3, reps: 17, weight: 0, unit: 'kg' },
      { id: 'e32', name: 'Glute-Ham Raises',       sets: 3, reps: 9,  weight: 0, unit: 'kg' },
      { id: 'e33', name: 'Seated Calf Raises',     sets: 4, reps: 17, weight: 0, unit: 'kg' },
    ],
  },
]

// Clean slate — no demo logs
export const SEED_LOGS = []
