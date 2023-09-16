import {
  AnimationPlaybackControls,
  animate,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { ResizingSheet, TraslatingSheet } from './components/Sheets'
import {
  DEFAULT_INITIAL_ANIMATION,
  DEFAULT_SNAP_ANIMATION_CONFIG,
} from './constants'
import { SheetInternalProvider, SheetProvider } from './context'
import { SheetMethods, SheetProps } from './types'
import {
  defaultBottomOverDragCallback,
  defaultGetNextSnapIndex,
  defaultTopOverDragCallback,
} from './utils'

const Sheet = memo(
  forwardRef<SheetMethods, SheetProps>(
    (
      {
        initialIndex,
        snapPoints,
        type,
        context,

        initialAnimation = DEFAULT_INITIAL_ANIMATION,
        snapAnimationConfig = DEFAULT_SNAP_ANIMATION_CONFIG,

        getNextSnapIndex = defaultGetNextSnapIndex,
        topOverdragCallback = defaultTopOverDragCallback,
        bottomOverdragCallback = defaultBottomOverDragCallback,

        onClose,
        ...props
      },
      ref
    ) => {
      const animationRef = useRef<AnimationPlaybackControls>()
      const initialHeight = useRef(0)
      const snapIndex = useMotionValue(initialIndex)

      const height = context ? useContext(context).height : useMotionValue(0)

      const lowestSnapPoint = useMemo(() => snapPoints[0], [snapPoints])
      const highestSnapPoint = useMemo(() => snapPoints.at(-1)!, [snapPoints])

      const indexes = useMemo(
        () => [...Array(snapPoints.length).keys()],
        [snapPoints]
      )
      const index = useTransform(height, snapPoints, indexes, { clamp: true })

      const progress = useTransform(
        height,
        [lowestSnapPoint, highestSnapPoint],
        [0, 1],
        { clamp: true }
      )

      useEffect(() => {
        snapToIndex(initialIndex, { animated: initialAnimation })

        return () => {
          onClose?.()
        }
      }, [])

      const snapToIndex = useCallback(
        (index: number, options?: { animated?: boolean }) => {
          snapIndex.set(index)

          if (options?.animated) {
            animationRef.current = animate(
              height,
              snapPoints[index],
              snapAnimationConfig
            )
          } else {
            height.set(snapPoints[index])
          }
        },
        [height, snapIndex, snapPoints, snapAnimationConfig]
      )

      const onPanStart = useCallback(() => {
        initialHeight.current = height.get()
        animationRef.current?.stop()
      }, [])

      const onPan = useCallback(
        (offsetY: number, topOverdrag = true) => {
          const latest = initialHeight.current - offsetY

          if (latest > highestSnapPoint) {
            height.set(
              highestSnapPoint +
                (topOverdrag
                  ? topOverdragCallback(latest - highestSnapPoint)
                  : 0)
            )
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
          highestSnapPoint,
          lowestSnapPoint,
          topOverdragCallback,
          bottomOverdragCallback,
        ]
      )

      const onPanEnd = useCallback(
        (velocityY: number) => {
          const target = getNextSnapIndex(snapPoints, height.get(), -velocityY)
          snapToIndex(target, { animated: true })
        },
        [height, snapPoints, snapToIndex, getNextSnapIndex]
      )

      useImperativeHandle(ref, () => ({ snapToIndex }), [snapToIndex])

      const contextVariables = useMemo(
        () => ({
          height,
          index,
          snapIndex,
          progress,
          snapToIndex,
        }),
        [height, index, snapIndex, progress, snapToIndex]
      )

      const internalVariables = useMemo(
        () => ({
          type,
          highestSnapPoint,
          lowestSnapPoint,
          highestSnapIndex: snapPoints.length - 1,
          onPanStart,
          onPan,
          onPanEnd,
        }),
        [
          highestSnapPoint,
          lowestSnapPoint,
          snapPoints,
          onPanStart,
          onPan,
          onPanEnd,
        ]
      )

      return (
        <SheetProvider value={contextVariables}>
          <SheetInternalProvider value={internalVariables}>
            {type === 'resizing' ? (
              <ResizingSheet
                snapAnimationConfig={snapAnimationConfig}
                {...props}
              />
            ) : (
              <TraslatingSheet
                snapAnimationConfig={snapAnimationConfig}
                {...props}
              />
            )}
          </SheetInternalProvider>
        </SheetProvider>
      )
    }
  )
)

Sheet.displayName = 'Sheet'
type Sheet = SheetMethods
export default Sheet
