import Sheet from './Sheet'
import type { SheetProps } from './types'
import SheetScrollView from './components/SheetScrollView'
import styled from 'styled-components'
import type { Meta } from '@storybook/react'

const meta = {
  title: 'Sheet',
  component: Sheet,
} satisfies Meta<SheetProps>

export default meta

const Template = (args: SheetProps) => (
  <Sheet {...args}>
    <SheetScrollView>
      <Box onClick={() => console.log('click')} />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </SheetScrollView>
  </Sheet>
)

export const Primary = Template.bind({})
Primary.args = {
  initialIndex: 1,
  snapPoints: [70, 300, 500],
}

const Box = styled.div`
  height: 100px;
  width: 100px;
  background-color: red;
  margin: 50px;
  flex: 0 0 auto;
`
