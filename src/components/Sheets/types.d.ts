import type { ValueAnimationTransition } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

export interface SheetsProps {
  snapAnimationConfig: ValueAnimationTransition<number>
  boxShadow?: string
  borderRadius?: string
  children?: ReactNode
  style?: CSSProperties
  className?: string
}
