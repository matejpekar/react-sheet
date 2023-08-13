import {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SheetStackVariables, SheetStackMethods, SheetItem } from '../types'

export const SheetStackContext = createContext<
  (SheetStackVariables & SheetStackMethods) | null
>(null)

interface SheetStackProviderProps {
  children?: ReactNode
}

export const SheetStackProvider = ({ children }: SheetStackProviderProps) => {
  const [sheetStack, setSheetStack] = useState<SheetItem[]>([])
  const [topSheetId, setTopSheetId] = useState<string | null>(null)

  const addSheet = useCallback(
    (sheet: ReactElement, id: string) =>
      setSheetStack((stack) => {
        const index = stack.findIndex((item) => item.id === id)
        if (index === -1) {
          return [...stack, { sheet, id }]
        }

        const item = stack[index]
        const newStack = stack.filter((_, i) => i !== index)
        newStack.push(item)
        return newStack
      }),
    []
  )

  const removeLastSheet = useCallback(
    () => setSheetStack((stack) => stack.slice(0, -1)),
    []
  )

  useEffect(() => {
    if (sheetStack.length === 0) {
      setTopSheetId(null)
    } else {
      setTopSheetId(sheetStack[sheetStack.length - 1].id)
    }
  }, [sheetStack])

  const removeAllSheets = useCallback(() => setSheetStack([]), [])

  const context = useMemo(
    () => ({
      sheetStack,
      topSheetId,
      addSheet,
      removeLastSheet,
      removeAllSheets,
    }),
    [sheetStack, topSheetId, addSheet, removeLastSheet, removeAllSheets]
  )

  return (
    <SheetStackContext.Provider value={context}>
      {children}
    </SheetStackContext.Provider>
  )
}
