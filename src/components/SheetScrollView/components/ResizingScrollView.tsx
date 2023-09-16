import {
  AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
} from 'framer-motion'
import { forwardRef, memo, useEffect, useReducer, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'
import styled from 'styled-components'
import { useSheet, useSheetInternal } from '../../../hooks'
import { DEFAULT_SCROLL_THRESHOLD } from '../constants'
import { SheetScrollViewInternalProvider } from '../context'
import { SheetScrollViewProps } from '../types'

const ResizingScrollView = forwardRef<HTMLDivElement, SheetScrollViewProps>(
  ({ scrollThreshold = DEFAULT_SCROLL_THRESHOLD, children }, ref) => {
    const { height, snapIndex } = useSheet()
    const { highestSnapIndex, highestSnapPoint, onPanStart, onPan, onPanEnd } =
      useSheetInternal()
    const scrollRef = useRef<HTMLDivElement>(null)
    const scrollAnimation = useRef<AnimationPlaybackControls>()
    const initialPageY = useRef(0)
    const initialHeight = useRef(0)
    const draggedHeight = useMotionValue(0)

    const scrollEnabledReducer = (
      _: boolean,
      action?: (state: boolean) => void
    ) => {
      const { scrollTop } = scrollRef.current!
      const scrollEnabled = scrollTop > 0 || scrollTop < scrollThreshold
      action?.(scrollEnabled)
      return scrollEnabled
    }

    const [scrollEnabled, setScrollEnabled] = useReducer(
      scrollEnabledReducer,
      false
    )

    // scroll to top when snap index changes
    useEffect(() => {
      const unsub = snapIndex.on('change', (index) => {
        if (index !== highestSnapIndex) {
          scrollAnimation.current?.stop()
          scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })

      return () => unsub()
    }, [snapIndex, highestSnapIndex])

    useEffect(() => {
      const unsub = draggedHeight.on('change', (latest) => {
        scrollRef.current!.scrollTop = latest - highestSnapPoint
      })

      return () => unsub()
    }, [highestSnapPoint])

    useEffect(() => {
      const touchMoveHandler = (e: TouchEvent) => {
        const { pageY } = e.touches[0]
        const offsetY = pageY - initialPageY.current
        draggedHeight.set(initialHeight.current - offsetY)
        onPan(offsetY, false)
      }

      const touchEndHandler = () => {
        const velocity = draggedHeight.getVelocity()
        if (scrollRef.current!.scrollTop > 0) {
          snapIndex.set(highestSnapIndex)
          scrollAnimation.current = animate(draggedHeight, 0, {
            type: 'inertia',
            velocity: velocity / 2,
          })
        } else {
          onPanEnd(-velocity)
        }
        setScrollEnabled()
      }

      if (!scrollEnabled) {
        scrollRef.current?.addEventListener('touchmove', touchMoveHandler)
        scrollRef.current?.addEventListener('touchend', touchEndHandler)
      }

      return () => {
        scrollRef.current?.removeEventListener('touchmove', touchMoveHandler)
        scrollRef.current?.removeEventListener('touchend', touchEndHandler)
      }
    }, [scrollEnabled])

    return (
      <SheetScrollViewInternalProvider value={{ scrollEnabled }}>
        <ScrollableView
          ref={mergeRefs([scrollRef, ref])}
          layout
          style={{ overflowY: scrollEnabled ? 'scroll' : 'hidden' }}
          onPointerDownCapture={(e) => e.stopPropagation()}
          onPointerUpCapture={(e) => e.stopPropagation()}
          onTouchStart={({ touches }) => {
            scrollAnimation.current?.stop()
            setScrollEnabled((state) => {
              if (!state) {
                initialPageY.current = touches[0].pageY
                initialHeight.current = height.get()
                onPanStart()
              }
            })
          }}
        >
          {children}
        </ScrollableView>
      </SheetScrollViewInternalProvider>
    )
  }
)

ResizingScrollView.displayName = 'ResizingScrollView'
export default memo(ResizingScrollView)

const ScrollableView = styled(motion.div)`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: 100%;
  height: 100%;
`
