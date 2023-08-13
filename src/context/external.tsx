import { createContext, forwardRef, ReactNode, useCallback, useImperativeHandle, useMemo } from 'react'
import type { SheetMethods, SheetVariables } from '../types'
import { animate, AnimationPlaybackControls, useMotionValue, useTransform } from 'framer-motion'
import { useSnapPoints } from '../hooks'
import { defaultSnapAnimationConfig } from '../constants'

export const SheetContext = createContext<(SheetMethods & SheetVariables) | null>(null)

export const SheetProvider = SheetContext.Provider

// export const SheetProvider = forwardRef<SheetMethods & SheetVariables, SheetProviderProps>(({ children }, ref) => {
//   const height = useMotionValue(0)
//   const snapIndex = useMotionValue(0)
//   const snapPoints = useSnapPoints()
//   const indexes = useMemo(() => [...Array(snapPoints.length).keys()], [snapPoints])

//   const index = useTransform(height, snapPoints, indexes, { clamp: true })
//   const progress = useTransform(height, [snapPoints[0], snapPoints.at(-1)!], [0, 1], { clamp: true })

//   const snapToIndex = useCallback(
//     (index: number, options?: { animated?: boolean; interruptible?: boolean }): AnimationPlaybackControls | null => {
//       snapIndex.set(index)

//       if (options?.animated) {
//         return animate(height, snapPoints[index], defaultSnapAnimationConfig)
//       }
//       height.set(snapPoints[index])
//       return null
//     },
//     [height, snapIndex, snapPoints],
//   )

//   useImperativeHandle(
//     ref,
//     () => ({
//       height,
//       index,
//       progress,
//       snapIndex,
//       snapToIndex,
//     }),
//     [height, index, progress, snapIndex, snapToIndex],
//   )

//   const variables = useMemo(
//     () => ({ height, index, progress, snapIndex, snapToIndex }),
//     [height, index, progress, snapIndex, snapToIndex],
//   )

//   return <SheetContext.Provider value={variables}>{children}</SheetContext.Provider>
// })

// SheetProvider.displayName = 'SheetProvider'
// export type SheetProvider = SheetMethods & SheetVariables
