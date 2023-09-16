import { Dispatch, SetStateAction, createContext } from 'react'

interface SheetStackContextInternalType {
  onMount: (index: number) => void
  onUnmount: () => void
  setSnaps: Dispatch<SetStateAction<number[]>>
}

export const SheetStackInternalContext =
  createContext<SheetStackContextInternalType | null>(null)

export const SheetStackInternalProvider = SheetStackInternalContext.Provider
