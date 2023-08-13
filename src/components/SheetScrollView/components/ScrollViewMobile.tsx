import { memo, useRef, useState, forwardRef, useMemo } from 'react'
import {
  AnimationPlaybackControls,
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import styled from 'styled-components'
import { useSheet, useSheetInternal } from '../../../hooks'
import { SheetScrollViewProps } from '../types'
import { SheetScrollViewInternalProvider } from '../context'
import { mergeRefs } from 'react-merge-refs'
import { scrollTreshold } from '../../../constants'

const ScrollViewMobile = forwardRef<HTMLDivElement, SheetScrollViewProps>(
  ({ children }, ref) => {
    const { highestSnapPoint } = useSheet()
    const { draggedHeight, setEnableTopOverdrag } = useSheetInternal()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollEnabled, setScrollEnabled] = useState(false)
    const scrollAnimation = useRef<AnimationPlaybackControls>()
    const contextVariables = useMemo(() => ({ scrollEnabled }), [scrollEnabled])
    const { scrollY } = useScroll({ container: scrollRef })

    useMotionValueEvent(scrollY, 'change', (latest) => {
      setScrollEnabled(latest > 0 || latest < scrollTreshold)
    })

    useMotionValueEvent(draggedHeight, 'change', (latest) => {
      scrollRef.current!.scrollTop = latest - highestSnapPoint
    })

    return (
      <SheetScrollViewInternalProvider value={contextVariables}>
        <ScrollableView
          ref={mergeRefs([scrollRef, ref])}
          layoutScroll
          style={{ touchAction: scrollEnabled ? 'auto' : 'none' }}
          onPointerDownCapture={(e) => scrollEnabled && e.stopPropagation()}
          onTouchStart={() => {
            setEnableTopOverdrag(false)
            scrollAnimation.current?.stop()
          }}
          onTouchEnd={() => setEnableTopOverdrag(true)}
          onPanEnd={() => {
            if (scrollEnabled) {
              scrollAnimation.current = animate(draggedHeight, 0, {
                type: 'inertia',
                velocity: draggedHeight.getVelocity() / 2,
              })
            }
          }}
        >
          {children}
        </ScrollableView>
      </SheetScrollViewInternalProvider>
    )
  }
)

ScrollViewMobile.displayName = 'ScrollViewMobile'
export default memo(ScrollViewMobile)

const ScrollableView = styled(motion.div)`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: 100%;
  height: 100%;
`
