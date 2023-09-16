import {
  AnimationPlaybackControls,
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import { forwardRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import styled from 'styled-components'
import { scrollTreshold } from '../../../constants'
import { useSheet, useSheetInternal } from '../../../hooks'
import { SheetScrollViewInternalProvider } from '../context'
import { SheetScrollViewProps } from '../types'

const ScrollViewMobile = forwardRef<HTMLDivElement, SheetScrollViewProps>(
  ({ children }, ref) => {
    const { highestSnapPoint } = useSheet()
    const { y } = useSheetInternal()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollEnabled, setScrollEnabled] = useState(false)
    const contextVariables = useMemo(() => ({ scrollEnabled }), [scrollEnabled])
    const { scrollY } = useScroll({ container: scrollRef })
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState(0)

    const [touch, setTouch] = useState(false)

    // useMotionValueEvent(y, 'change', (latest) => {
    //   if (!touch && scrollRef.current) {
    //     scrollRef.current.scrollTop = latest
    //   }
    // })

    useMotionValueEvent(scrollY, 'change', (latest) => {
      if (!scrollEnabled) {
        y.set(Math.max(highestSnapPoint - latest, 1))
      }
      setScrollEnabled(
        scrollEnabled
          ? latest > 0 || latest < scrollTreshold
          : latest > highestSnapPoint
      )
    })

    useEffect(() => {
      setContentHeight(contentRef.current!.scrollHeight)

      scrollRef.current!.scrollTop = 200
    }, [])

    useEffect(() => {
      if (scrollEnabled) {
        scrollRef.current!.scrollTop =
          scrollRef.current!.scrollTop - highestSnapPoint
      } else {
        scrollRef.current!.scrollTop =
          scrollRef.current!.scrollTop + highestSnapPoint
      }
    }, [scrollEnabled])

    return (
      <SheetScrollViewInternalProvider value={contextVariables}>
        <ScrollableView
          ref={mergeRefs([scrollRef, ref])}
          layoutScroll
          onPointerDownCapture={(e) => e.stopPropagation()}
          onPointerUpCapture={(e) => e.stopPropagation()}
          onTouchStart={() => {
            setTouch(true)
            const scroll = scrollRef.current!.scrollTop
            if (
              scroll > highestSnapPoint ||
              (scrollEnabled && (scroll > 0 || scroll < scrollTreshold))
            ) {
              setScrollEnabled(true)
            } else {
              setScrollEnabled(false)
            }
          }}
          onTouchEnd={() => setTouch(false)}
        >
          <ExtendedContent
            // layout="size"
            // layoutDependency={scrollEnabled}
            style={{
              height: scrollEnabled
                ? contentHeight
                : contentHeight + highestSnapPoint,
            }}
          >
            <Content ref={contentRef}>{children}</Content>
          </ExtendedContent>
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
  height: 80%;

  /* &::-webkit-scrollbar {
    display: none;
  } */
`

const ExtendedContent = styled(motion.div)``

const Content = styled.div`
  position: sticky;
  top: 0;
`
