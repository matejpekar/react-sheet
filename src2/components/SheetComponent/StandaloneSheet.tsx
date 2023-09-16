import {
  AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { defaultSnapAnimationConfig } from '../../constants'
import { SheetInternalProvider, SheetProvider } from '../../context'
import { SheetProps } from '../../types'
import {
  defaultBottomOverDragCallback,
  defaultTopOverDragCallback,
} from '../../utils'

const StandaloneSheet = ({
  initialIndex,
  snapPoints,

  borderRadius,
  boxShadow,

  initialAnimation = true,
  snapAnimationConfig = defaultSnapAnimationConfig,

  topOverdragCallback = defaultTopOverDragCallback,
  bottomOverdragCallback = defaultBottomOverDragCallback,

  onClose,
  children,
}: SheetProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
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

      const target = highestSnapPoint - snapPoints[index]
      console.log(target)
      if (options?.animated) {
        return animate(y, target, {
          velocity: -y.getVelocity(),
          ...snapAnimationConfig,
        })
      }
      y.set(target)
    },
    [height, snapIndex, snapPoints, snapAnimationConfig]
  )

  const onDragEnd = useCallback(
    (velocityY: number) => {
      const target = highestSnapPoint - y.get() - velocityY / 10
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
      y,
      draggedHeight,
      setEnableTopOverdrag,
    }),
    [y, draggedHeight, setEnableTopOverdrag]
  )

  return (
    <SheetProvider value={contextVariables}>
      <SheetInternalProvider value={internalContextVariables}>
        <Container
          ref={ref}
          drag="y"
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            bottom: highestSnapPoint - lowestSnapPoint,
          }}
          dragElastic={{
            top: 0.08,
            bottom: 0.3,
          }}
          onDragEnd={(_, { velocity }) => onDragEnd(velocity.y)}
          // exit={{ height: 0 }}
          transition={snapAnimationConfig}
          // animate={{ height: snapPoints[initialIndex] }}
          style={{ y, height: highestSnapPoint, borderRadius, boxShadow }}
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
