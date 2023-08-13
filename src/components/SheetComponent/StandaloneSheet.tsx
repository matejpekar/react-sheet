import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SheetProps } from '../../types'
import {
  AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import styled from 'styled-components'
import { defaultSnapAnimationConfig } from '../../constants'
import {
  defaultBottomOverDragCallback,
  defaultTopOverDragCallback,
} from '../../utils'
import { SheetInternalProvider, SheetProvider } from '../../context'

const StandaloneSheet = ({
  initialIndex,
  snapPoints,

  initialAnimation = true,
  snapAnimationConfig = defaultSnapAnimationConfig,

  topOverdragCallback = defaultTopOverDragCallback,
  bottomOverdragCallback = defaultBottomOverDragCallback,

  onClose,
  children,
}: SheetProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const height = useMotionValue(initialAnimation ? 0 : snapPoints[initialIndex])
  const snapIndex = useMotionValue(initialIndex)

  const indexes = useMemo(
    () => [...Array(snapPoints.length).keys()],
    [snapPoints]
  )
  const index = useTransform(height, snapPoints, indexes, { clamp: true })

  const lowestSnapPoint = useMemo(() => snapPoints[0], [snapPoints])
  const highestSnapPoint = useMemo(() => snapPoints.at(-1)!, [snapPoints])

  const animationRef = useRef<AnimationPlaybackControls>()

  const progress = useTransform(
    height,
    [lowestSnapPoint, highestSnapPoint],
    [0, 1],
    { clamp: true }
  )

  const draggedHeight = useMotionValue(0)
  const [enableTopOverdrag, setEnableTopOverdrag] = useState(true)

  useEffect(() => {
    return () => {
      onClose?.()
    }
  }, [])

  const snapToIndex = useCallback(
    (index: number, options?: { animated?: boolean }) => {
      snapIndex.set(index)

      if (options?.animated) {
        return animate(height, snapPoints[index], snapAnimationConfig)
      }
      height.set(snapPoints[index])
    },
    [height, snapIndex, snapPoints, snapAnimationConfig]
  )

  const onPan = useCallback(
    (delta: number) => {
      animationRef.current?.stop()
      const latest = draggedHeight.get() - delta
      draggedHeight.set(latest)

      if (latest > highestSnapPoint) {
        if (enableTopOverdrag) {
          height.set(
            highestSnapPoint + topOverdragCallback(latest - highestSnapPoint)
          )
        } else {
          height.set(highestSnapPoint)
        }
      } else if (latest < lowestSnapPoint) {
        height.set(
          lowestSnapPoint - bottomOverdragCallback(lowestSnapPoint - latest)
        )
      } else {
        height.set(latest)
      }
    },
    [
      height,
      draggedHeight,
      lowestSnapPoint,
      highestSnapPoint,
      enableTopOverdrag,
      topOverdragCallback,
      bottomOverdragCallback,
    ]
  )

  const onPanEnd = useCallback(
    (velocityY: number) => {
      const target = height.get() - velocityY / 10
      const toValue = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
      )

      animationRef.current = snapToIndex(snapPoints.indexOf(toValue), {
        animated: true,
      })
    },
    [height, snapPoints, snapToIndex]
  )

  const contextVariables = useMemo(
    () => ({
      height,
      index,
      snapIndex,
      progress,
      highestSnapPoint,
      lowestSnapPoint,
      snapToIndex,
    }),
    [
      height,
      index,
      snapIndex,
      progress,
      snapToIndex,
      highestSnapPoint,
      lowestSnapPoint,
    ]
  )

  const internalContextVariables = useMemo(
    () => ({
      draggedHeight,
      setEnableTopOverdrag,
    }),
    [draggedHeight, setEnableTopOverdrag]
  )

  return (
    <SheetProvider value={contextVariables}>
      <SheetInternalProvider value={internalContextVariables}>
        <Container
          ref={ref}
          layout="size"
          layoutDependency={height}
          onPointerDown={() => draggedHeight.set(height.get())}
          onPan={(_, { delta }) => onPan(delta.y)}
          onPanEnd={(_, { velocity }) => onPanEnd(velocity.y)}
          exit={{ height: 0 }}
          transition={snapAnimationConfig}
          animate={{ height: snapPoints[initialIndex] }}
          style={{
            height,
            borderTopLeftRadius: 10, // has to be here
            borderTopRightRadius: 10, // has to be here
          }}
        >
          {children}
        </Container>
      </SheetInternalProvider>
    </SheetProvider>
  )
}

export default memo(StandaloneSheet)

const Container = styled(motion.div)`
  position: absolute;
  overflow: hidden;
  touch-action: none;
  background-color: gray;
  bottom: 0;
  width: 100%;
`
