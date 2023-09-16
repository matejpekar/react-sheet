import { useContext } from 'react'
import { StackSheet, StandaloneSheet } from './components/SheetComponent'
import { SheetStackInternalContext } from './components/SheetStack/context'
import { SheetProps } from './types'

const Sheet = (props: SheetProps) => {
  const stackContext = useContext(SheetStackInternalContext)

  return stackContext === null ? (
    <StandaloneSheet {...props} />
  ) : (
    <StackSheet {...props} />
  )
}

export default Sheet
