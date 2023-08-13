import { useState, useMemo, useCallback, useRef, cloneElement } from 'react'
import { SheetStackInternalProvider } from './context'
import { AnimatePresence } from 'framer-motion'
import { SheetStackProps } from './types'
import { SheetProvider } from '../../context'
import { useSheetStack } from './hooks'

const SheetStack = ({ children }: SheetStackProps) => {
  const [snaps, setSnaps] = useState<number[]>([])
  const sheetRef = useRef<SheetProvider>(null)
  const { sheetStack } = useSheetStack()

  const onMount = useCallback(
    (index: number) =>
      sheetRef.current?.snapToIndex(index, {
        animated: true,
        interruptible: false,
      }),
    []
  )

  const onUnmount = useCallback(() => {
    const target = snaps.at(-1)!
    sheetRef.current?.snapToIndex(target, {
      animated: sheetRef.current!.index.get() < target,
      interruptible: false,
    })
  }, [snaps])

  const internalContext = useMemo(
    () => ({
      setSnaps,
      onMount,
      onUnmount,
    }),
    [setSnaps, onMount, onUnmount]
  )

  return (
    <SheetProvider ref={sheetRef}>
      {children}
      <SheetStackInternalProvider value={internalContext}>
        <AnimatePresence presenceAffectsLayout={false}>
          {sheetStack.map(({ sheet }, index) =>
            cloneElement(sheet, { key: index })
          )}
        </AnimatePresence>
      </SheetStackInternalProvider>
    </SheetProvider>
  )
}

export default SheetStack
