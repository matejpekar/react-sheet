import type { ValueAnimationTransition } from 'framer-motion'
import type { ReactElement, ReactNode } from 'react'

export interface SheetStackProps {
  snapAnimationConfig?: ValueAnimationTransition<number>
  children?: ReactNode
}

export interface SheetItem {
  sheet: ReactElement
  id: string
}

export interface SheetStackVariables {
  stack: ReactElement
  top: SheetItem | null
}

export interface SheetStackMethods {
  push: (sheet: ReactElement, id: string) => void
  pop: () => void
  clear: () => void
  empty: () => boolean
}
