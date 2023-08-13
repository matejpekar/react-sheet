import { useContext } from 'react'
import { SheetStackInternalContext } from '../context'

export const useSheetStackInternal = () => {
  const context = useContext(SheetStackInternalContext)

  if (context === null) {
    throw "'useSheetStackInternal' cannot be used out of the SheetStackInternalProvider!"
  }

  return context
}
