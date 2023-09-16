import { useContext } from 'react'
import { SheetContext } from '../context'

export const useSheet = () => {
  const context = useContext(SheetContext)

  if (context === null) {
    throw "'useSheet' cannot be used out of the SheetProvider!"
  }

  return context
}
