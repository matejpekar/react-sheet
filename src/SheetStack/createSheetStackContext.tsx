import { createContext } from 'react'
import SheetStackProvider from './SheetStackProvider'
import type {
  SheetStackMethods,
  SheetStackProps,
  SheetStackVariables,
} from './types'

export const createSheetStackContext = () => {
  const { Consumer, Provider, displayName } = createContext<
    (SheetStackVariables & SheetStackMethods) | null
  >(null)

  return {
    Consumer,
    Provider: (props: SheetStackProps) => (
      <SheetStackProvider Provider={Provider} {...props} />
    ), // SheetStackProvider.bind(null, { Provider: Provider }),
    displayName,
  }
}
