import { MotionValue } from 'framer-motion'
import { Dispatch, SetStateAction, createContext } from 'react'

interface SheetInternalContextType {
  draggedHeight: MotionValue<number>

  setEnableTopOverdrag: Dispatch<SetStateAction<boolean>>
}

export const SheetInternalContext =
  createContext<SheetInternalContextType | null>(null)

export const SheetInternalProvider = SheetInternalContext.Provider
