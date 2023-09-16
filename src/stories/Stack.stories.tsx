import type { Meta, StoryObj } from '@storybook/react'
import { useContext } from 'react'
import Sheet from '../Sheet'
import { createSheetStackContext } from '../SheetStack'
import {
  SheetStackMethods,
  SheetStackProps,
  SheetStackVariables,
} from '../SheetStack/types'

const Group = () => {
  const Context = createSheetStackContext()

  return (
    <Context.Provider>
      <Stack Context={Context} />
    </Context.Provider>
  )
}

const Stack = ({
  Context,
}: {
  Context: {
    Consumer: React.Consumer<(SheetStackVariables & SheetStackMethods) | null>
    Provider: React.Provider<(SheetStackVariables & SheetStackMethods) | null>
    displayName: string | undefined
  }
}) => {
  const { stack } = useContext(Context)!

  return stack
}

const meta = {
  title: 'SheetStack',
  component: Group,
} satisfies Meta<{}>

export default meta

export const SheetStack = {
  args: {},
} satisfies StoryObj<typeof meta>
