import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { SheetProps } from '../../types'
import {
  motion,
  useIsPresent,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import styled from 'styled-components'
import { useScrollable, useSheet, useSnapPoints } from '../../hooks'
import { SheetInternalProvider } from '../../context'
import { defaultSnapAnimationConfig } from '../../constants'
import { useSheetStackInternal } from '../SheetStack/hooks'

const StackSheet = ({
  index,
  initialAnimation = true,
  children,
  onClose,
}: SheetProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const snapPoints = useSnapPoints()
  const { height, index: sheetIndex } = useSheet()
  const [panEnabled, setPanEnabled] = useState(true)
  const [enableTopOverdrag, setEnableTopOverdrag] = useState(true)
  const { onPan, onPanEnd } = useScrollable(enableTopOverdrag)
  const [loaded, setLoaded] = useState(false)
  const isPresent = useIsPresent()
  const internalHeight = useMotionValue(0)

  const highestSnap = useMemo(() => snapPoints.at(-1)!, [snapPoints])
  const lowestSnap = useMemo(() => snapPoints[0], [snapPoints])

  const boxShadow = useTransform(
    sheetIndex,
    [1, 2],
    ['0px -2px 2px rgba(0, 0, 0, 0.05)', '0px -2px 2px rgba(0, 0, 0, 0)'],
    { clamp: true }
  )

  const { onMount, onUnmount, setSnaps } = useSheetStackInternal()

  useEffect(() => {
    const temp = Math.round(sheetIndex.get())
    setSnaps((snaps) => [...snaps, temp])
    onMount(index)

    return () => {
      setSnaps((snaps) => snaps.slice(0, -1))
      onClose?.()
    }
  }, [])

  useEffect(() => {
    if (!isPresent) {
      setLoaded(!isPresent)
    }
  }, [isPresent])

  const contextVariables = useMemo(
    () => ({
      lowestSnap,
      highestSnap,
      highestSnapIndex: snapPoints.length - 1,
      lowestSnapIndex: 0,
      enableTopOverdrag,
      setEnableTopOverdrag,
      setPanEnabled,
    }),
    [
      lowestSnap,
      highestSnap,
      snapPoints,
      enableTopOverdrag,
      setEnableTopOverdrag,
      setPanEnabled,
    ]
  )

  useEffect(() => {
    const unsub = height.on(
      'change',
      (h) => loaded && isPresent && internalHeight.set(h)
    )

    return () => {
      unsub()
    }
  }, [height, internalHeight, loaded, isPresent])

  useEffect(() => {
    if (!isPresent) {
      onUnmount()
    }
  }, [isPresent, onUnmount])

  return (
    <SheetInternalProvider value={contextVariables}>
      <Container
        ref={ref}
        layout="size"
        layoutDependency={internalHeight}
        onPan={(_, { offset }) => panEnabled && onPan(offset.y)}
        onPanEnd={(_, { velocity }) => panEnabled && onPanEnd(velocity.y)}
        style={{
          height: internalHeight,
          boxShadow,
          borderTopLeftRadius: 10, // has to be here
          borderTopRightRadius: 10, // has to be here
        }}
        initial={{ height: initialAnimation ? 0 : snapPoints[index] }}
        exit={{ height: 0 }}
        // @ts-ignore
        onAnimationComplete={({ height }) =>
          height >= lowestSnap && setLoaded(true)
        }
        transition={defaultSnapAnimationConfig}
        animate={{ height: snapPoints[index] }}
      >
        {children}
      </Container>
    </SheetInternalProvider>
  )
}

export default memo(StackSheet)

const Container = styled(motion.div)`
  touch-action: none;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden;
  background-color: gray;
  bottom: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 100%;
  @media (min-width: 800px) {
    width: 30%;
    max-width: 500px;
    left: 25px;
  }
`
