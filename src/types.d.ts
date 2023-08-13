import type { MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

export interface SheetProps {
  initialIndex: number
  snapPoints: number[]

  initialAnimation?: boolean
  children?: ReactNode

  snapAnimationConfig?: ValueAnimationTransition<number>

  onClose?: () => void

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
  snapToIndex: (
    index: number,
    options?: {
      animated?: boolean
    }
  ) => AnimationPlaybackControls | undefined
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

  lowestSnapPoint: number
  highestSnapPoint: number
}
