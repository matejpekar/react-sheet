import { useContext } from 'react'
import { SheetStackContext } from '../context'

export const useSheetStack = () => {
  const context = useContext(SheetStackContext)

  if (context === null) {
    throw "'useSheetStack' cannot be used out of the SheetStackProvider!"
  }

  return context
}
