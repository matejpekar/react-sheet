import type { Meta, StoryObj } from '@storybook/react'
import styled from 'styled-components'
import Sheet from '../Sheet'
import SheetView from '../components/SheetView'
import type { SheetProps } from '../types'

const meta = {
  title: 'Sheet',
  component: Sheet,
  argTypes: {
    type: {
      options: ['translating', 'resizing'],
      control: { type: 'radio' },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<SheetProps>

export default meta

const Crossed = styled(SheetView)`
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to top left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(50% - 0.8px),
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) calc(50% + 0.8px),
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(
      to top right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(50% - 0.8px),
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) calc(50% + 0.8px),
      rgba(0, 0, 0, 0) 100%
    );
`

export const SheetType = {
  args: {
    type: 'translating',
    initialIndex: 1,
    snapPoints: [70, 300, 500],
    children: <Crossed />,
  },
} satisfies StoryObj<typeof meta>
