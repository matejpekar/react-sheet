import { useCallback, useRef } from 'react'
import { defaultBottomOverDragCallback, defaultTopOverDragCallback } from '../utils'
import { useSnapPoints } from './useSnapPoints'
import { AnimationPlaybackControls, useMotionValue } from 'framer-motion'
import { useSheet } from './useSheet'

export const useScrollable = (enableTopOverdrag: boolean) => {
  const { height, snapToIndex } = useSheet()
  const startHeight = useMotionValue<number | null>(null)
  const snapPoints = useSnapPoints()
  const highestSnapPoint = snapPoints.at(-1)!
  const lowestSnapPoint = snapPoints[0]
  const animationRef = useRef<AnimationPlaybackControls | null>(null)

  const onPan = useCallback(
    (delta: number) => {
      if (startHeight.get() === null) {
        startHeight.set(height.get(), false)
      }
      animationRef.current?.stop()

      const draggedHeight = startHeight.get()! - delta
      if (draggedHeight > highestSnapPoint) {
        if (enableTopOverdrag) {
          height.set(highestSnapPoint + defaultTopOverDragCallback(draggedHeight - highestSnapPoint))
        } else {
          height.set(highestSnapPoint)
        }
      } else if (draggedHeight < lowestSnapPoint) {
        height.set(lowestSnapPoint - defaultBottomOverDragCallback(lowestSnapPoint - draggedHeight))
      } else {
        height.set(draggedHeight)
      }
    },
    [height, startHeight, highestSnapPoint, lowestSnapPoint, enableTopOverdrag],
  )

  const onPanEnd = useCallback(
    (velocityY: number) => {
      const target = height.get() - velocityY / 10
      const toValue = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
      )

      startHeight.set(null, false)
      animationRef.current = snapToIndex(snapPoints.indexOf(toValue), {
        animated: true,
        interruptible: true,
      })
    },
    [height, startHeight, snapPoints, snapToIndex],
  )

  return {
    onPan,
    onPanEnd,
  }
}
