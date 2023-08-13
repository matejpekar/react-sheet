import { createContext } from 'react'

interface SheetScrollViewInternalContextType {
  scrollEnabled: boolean
}

export const SheetScrollViewInternalContext =
  createContext<SheetScrollViewInternalContextType | null>(null)

export const SheetScrollViewInternalProvider =
  SheetScrollViewInternalContext.Provider
