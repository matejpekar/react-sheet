import type { ValueAnimationTransition } from 'framer-motion'

/**
 * Scroll offset threshold for the sheet collapse
 */
export const scrollTreshold = -20 as const

/**
 * Config for the sheet snap animation after drag ends
 */
export const defaultSnapAnimationConfig: ValueAnimationTransition<number> = {
  type: 'spring',
  damping: 40,
  stiffness: 500,
} as const
