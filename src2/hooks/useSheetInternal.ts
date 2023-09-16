import { useContext } from 'react'
import { SheetInternalContext } from '../context'

export const useSheetInternal = () => {
  const context = useContext(SheetInternalContext)

  if (context === null) {
    throw "'useSheetInternal' cannot be used out of the SheetInternalProvider!"
  }

  return context
}
