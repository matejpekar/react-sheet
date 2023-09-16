import { AnimatePresence, animate, useMotionValue } from 'framer-motion'
import {
  Provider,
  ReactElement,
  cloneElement,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DEFAULT_SNAP_ANIMATION_CONFIG } from '../constants'
import {
  SheetItem,
  SheetStackMethods,
  SheetStackProps,
  SheetStackVariables,
} from './types'

const SheetStackProvider = forwardRef<
  SheetStackMethods,
  SheetStackProps & {
    Provider: Provider<(SheetStackVariables & SheetStackMethods) | null>
  }
>(
  (
    { snapAnimationConfig = DEFAULT_SNAP_ANIMATION_CONFIG, Provider, children },
    ref
  ) => {
    const height = useMotionValue(0)
    const [stack, setStack] = useState<SheetItem[]>([])
    const snaps = useRef<number[]>([])

    const snapToHeight = (snapHeight: number) => {
      animate(height, snapHeight, snapAnimationConfig)
    }

    const push = useCallback(
      (sheet: ReactElement, id: string) =>
        setStack((stack) => {
          const index = stack.findIndex((item) => item.id === id)
          if (index === -1) {
            snaps.current.push(height.get())
            return [...stack, { sheet, id }]
          }

          const head = snaps.current.slice(0, index + 1)
          const tail = snaps.current.slice(index + 2)
          snaps.current = [...head, ...tail, height.get()]

          const item = stack[index]
          const newStack = stack.filter((_, i) => i !== index)
          newStack.push(item)
          return newStack
        }),
      [height]
    )

    const pop = useCallback(() => {
      setStack((stack) => stack.slice(0, -1))
      snapToHeight(snaps.current.at(-1) ?? 0)
    }, [])

    const empty = useCallback(() => stack.length === 0, [stack])

    const clear = useCallback(() => {
      snaps.current = []
      setStack([])
      snapToHeight(0)
    }, [])

    useImperativeHandle(ref, () => ({ push, pop, clear, empty }), [
      push,
      pop,
      clear,
      empty,
    ])

    const variables = useMemo(
      () => ({
        top: stack.at(-1) ?? null,
        stack: (
          <AnimatePresence presenceAffectsLayout={false}>
            {stack.map(({ sheet }, index) =>
              cloneElement(sheet, { key: index })
            )}
          </AnimatePresence>
        ),
        push,
        pop,
        clear,
        empty,
      }),
      [stack, empty, push, clear, pop]
    )

    return <Provider value={variables}>{children}</Provider>
  }
)

type SheetStackProvider = SheetStackMethods
export default SheetStackProvider
