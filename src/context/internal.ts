import { createContext } from 'react'
import type { SheetType } from '../types'

interface SheetInternalContextType {
  type: SheetType
  lowestSnapPoint: number
  highestSnapPoint: number
  highestSnapIndex: number

  onPanStart: () => void
  onPan: (offsetY: number, topOverdrag?: boolean) => void
  onPanEnd: (velocityY: number) => void
}

export const SheetInternalContext =
  createContext<SheetInternalContextType | null>(null)

export const SheetInternalProvider = SheetInternalContext.Provider
