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
import { useSheet, useSheetInternal } from '../../../hooks'
import { DEFAULT_SCROLL_THRESHOLD } from '../constants'
import { SheetScrollViewInternalProvider } from '../context'
import { useScrollDirection } from '../hooks'
import { SheetScrollViewProps } from '../types'

const TranslatingScrollView = forwardRef<HTMLDivElement, SheetScrollViewProps>(
  ({ scrollThreshold = DEFAULT_SCROLL_THRESHOLD, children }, ref) => {
    const { height, progress } = useSheet()
    const { highestSnapPoint } = useSheetInternal()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollEnabled, setScrollEnabled] = useState(false)
    const contextVariables = useMemo(() => ({ scrollEnabled }), [scrollEnabled])
    const { scrollY } = useScroll({ container: scrollRef })
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState(0)

    const [willBeScrollEnabled, setWillBeScrollEnabled] = useState(false)

    const scrollDirection = useScrollDirection(scrollRef)

    const [touch, setTouch] = useState(false)

    // useMotionValueEvent(y, 'change', (latest) => {
    //   if (!touch && scrollRef.current) {
    //     scrollRef.current.scrollTop = latest
    //   }
    // })

    // useEffect(() => {
    //   if (!touch) {
    //     setScrollEnabled(willBeScrollEnabled)
    //   }
    // }, [willBeScrollEnabled, touch])

    useMotionValueEvent(scrollY, 'change', (latest) => {
      if (!scrollEnabled) {
        height.set(Math.max(highestSnapPoint - latest, 1))
      }
      // setWillBeScrollEnabled(
      //   scrollEnabled
      //     ? latest > 0 || latest < scrollTreshold
      //     : latest > highestSnapPoint
      // )
    })

    useEffect(() => {
      setContentHeight(contentRef.current!.scrollHeight)

      scrollRef.current!.scrollTop = 0
    }, [])

    useEffect(() => {
      console.log(scrollRef.current!.scrollTop)
      if (scrollEnabled) {
        scrollRef.current!.scrollTop = scrollY.get() - highestSnapPoint
      } else {
        scrollRef.current!.scrollTop += highestSnapPoint
      }
    }, [scrollEnabled])

    return (
      <SheetScrollViewInternalProvider value={contextVariables}>
        <ScrollableView
          ref={mergeRefs([scrollRef, ref])}
          layoutScroll
          onPointerDownCapture={(e) => {
            console.log('pointerdown')
            e.stopPropagation()
          }}
          onPointerUpCapture={(e) => e.stopPropagation()}
          onTouchStart={() => {
            console.log('touch')
            setTouch(true)
            const scroll = scrollRef.current!.scrollTop
            // console.log(scroll, highestSnapPoint)
            setScrollEnabled(
              scrollEnabled
                ? scroll > 0 || scroll < scrollThreshold
                : scroll > highestSnapPoint
            )
          }}
          onTouchEnd={() => {
            setTouch(false)
            if (
              progress.get() < 1 ||
              (!scrollEnabled && scrollDirection === 'up')
            ) {
              scrollRef.current!.scrollTop += 1
            }
          }}
        >
          <ExtendedContent
            // layout="size"
            // layoutDependency={scrollEnabled}
            style={{
              // rotateX: 180,
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

TranslatingScrollView.displayName = 'TranslatingScrollView'
export default memo(TranslatingScrollView)

const ScrollableView = styled(motion.div)`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: 100%;
  height: 80%;
  -webkit-overflow-scrolling: touch;

  /* &::-webkit-scrollbar {
    display: none;
  } */
`

const ExtendedContent = styled(motion.div)``

const Content = styled.div`
  position: sticky;
  top: 0;
`
