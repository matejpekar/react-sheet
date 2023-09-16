import { useContext } from 'react'
import { SheetScrollViewInternalContext } from '../context'

export const useSheetScrollViewInternal = () => {
  const context = useContext(SheetScrollViewInternalContext)

  if (context === null) {
    throw "'useSheetScrollViewInternal' cannot be used out of the SheetScrollViewInternalProvider!"
  }

  return context
}
