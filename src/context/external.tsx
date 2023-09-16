import { createContext } from 'react'
import type { SheetMethods, SheetVariables } from '../types'

export const SheetContext = createContext<
  (SheetMethods & SheetVariables) | null
>(null)

export const SheetProvider = SheetContext.Provider
