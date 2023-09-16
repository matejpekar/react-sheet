import type { ValueAnimationTransition } from 'framer-motion'

export const DEFAULT_INITIAL_ANIMATION = true

/**
 * Config for the sheet snap animation after drag ends
 */
export const DEFAULT_SNAP_ANIMATION_CONFIG: ValueAnimationTransition<number> = {
  type: 'spring',
  damping: 40,
  stiffness: 500,
} as const
