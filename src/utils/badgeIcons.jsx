import {
  Award,
  CalendarDays,
  CircleCheck,
  Dumbbell,
  Flag,
  Flame,
  Footprints,
  Medal,
  Mountain,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'

/** Lucide icon per badge id — crisp on all platforms (no emoji) */
export const BADGE_ICONS = {
  first_rep:     Flag,
  hat_trick:     Sparkles,
  week_warrior:  Shield,
  month_strong:  CalendarDays,
  century:       Trophy,
  iron_streak:   Flame,
  unstoppable:   Zap,
  full_house:    CircleCheck,
  dedicated:     Target,
  volume_club:   Dumbbell,
  tonnage:       Mountain,
  pr_hunter:     Medal,
  push_master:   TrendingUp,
  pull_master:   TrendingDown,
  leg_day_hero:  Footprints,
}

export const BadgeIconFallback = Award
