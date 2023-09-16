import type { Meta } from '@storybook/react'
import styled from 'styled-components'
import Sheet from './Sheet'
import SheetScrollView from './components/SheetScrollView'
import SheetView from './components/SheetView'
import type { SheetProps } from './types'

const meta = {
  title: 'Sheet',
  component: Sheet,
} satisfies Meta<SheetProps>

export default meta

const Template = (args: SheetProps) => (
  <Sheet {...args}>
    <SheetView style={{ backgroundColor: 'red', height: '100px' }}>
      Ahool
    </SheetView>
    <SheetScrollView>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          overflowX: 'scroll',
        }}
      >
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </div>
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

  // <ScrollV>
  //   {/* <div
  //     style={{
  //       position: 'relative',
  //       height: '2000px',
  //       backgroundColor: 'blue',
  //       display: 'flex',
  //       alignContent: 'flex-end',
  //     }}
  //   > */}
  //   <div style={{ height: '1000px' }}>
  //     <div
  //       style={{
  //         position: 'sticky',
  //         top: 0,
  //         // height: 'max-content',
  //         backgroundColor: 'gray',
  //       }}
  //     >
  //       <Box />
  //       <Box />
  //       <Box />
  //       <Box />
  //       {/* </div> */}
  //     </div>
  //   </div>
  // </ScrollV>
)

export const Primary = Template.bind({})
Primary.args = {
  initialIndex: 1,
  snapPoints: [70, 300, 500],
}

const Box = styled.div`
  height: 100px;
  width: 100px;
  background-color: green;
  margin: 50px;
  flex: 0 0 auto;
`

const ScrollV = styled.div`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: 100%;
  height: 500px;
  background-color: red;
`
