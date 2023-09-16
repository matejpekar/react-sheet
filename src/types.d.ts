import type { MotionValue, ValueAnimationTransition } from 'framer-motion'
import type { CSSProperties, Context, ReactNode } from 'react'

export type SheetType = 'translating' | 'resizing'

export interface SheetProps {
  initialIndex: number
  snapPoints: number[]
  type: SheetType

  context?: Context<{ height: MotionValue<number> }>
  initialAnimation?: boolean
  children?: ReactNode

  boxShadow?: string
  borderRadius?: string
  style?: CSSProperties
  className?: string

  snapAnimationConfig?: ValueAnimationTransition<number>

  onClose?: () => void

  getNextSnapIndex?: (
    snapPoints: number[],
    height: number,
    velocity: number
  ) => number

  /**
   * Calculates the top over drag
   * @param x distance from the top snap point
   *
   * @returns distance to display
   */
  topOverdragCallback?: (x: number) => number

  /**
   * Calculates the top over drag
   * @param x distance from the top snap point
   *
   * @returns distance to display
   */
  bottomOverdragCallback?: (x: number) => number
}

export interface SheetMethods {
  /**
   * Snap to one of the provided indexes of `snapPoints`.
   * @param index snap point index.
   * @param options
   *  - `animated` whether to animate the transition or not.
   *  - `interruptible` whether can be interrupted or not.
   */
  snapToIndex: (index: number, options?: { animated?: boolean }) => void
}

export interface SheetVariables {
  /**
   * Current sheet height.
   */
  height: MotionValue<number>
  /**
   * Current position index.
   */
  index: MotionValue<number>
  /**
   * Current progress of sheet height -> [0,1]
   */
  progress: MotionValue<number>
  /**
   * Current snap point index.
   */
  snapIndex: MotionValue<number>
}
