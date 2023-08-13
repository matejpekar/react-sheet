import styled from 'styled-components'
import { useSheetScrollViewInternal } from '../hooks'
import { HTMLAttributes, forwardRef } from 'react'

export interface NestedSheetScrollViewProps
  extends HTMLAttributes<HTMLDivElement> {
  vertical?: boolean
  style?: Omit<
    HTMLAttributes<HTMLDivElement>['style'],
    'touchAction' | 'overflowY' | 'overflowX' | 'overscrollBehavior'
  >
}

const NestedSheetScrollView = forwardRef<
  HTMLDivElement,
  NestedSheetScrollViewProps
>(({ children, vertical = false, style, ...props }, ref) => {
  const { scrollEnabled } = useSheetScrollViewInternal()

  return (
    <Wrapper
      ref={ref}
      $vertical={vertical}
      style={{
        touchAction: scrollEnabled ? 'pan-x pan-y' : 'pan-x',
      }}
      {...props}
    >
      {children}
    </Wrapper>
  )
})

type NestedSheetScrollView = HTMLDivElement
NestedSheetScrollView.displayName = 'NestedSheetScrollView'
export default NestedSheetScrollView

const Wrapper = styled.div<{ $vertical: boolean }>`
  overflow-y: ${({ $vertical }) => ($vertical ? 'auto' : 'hidden')};
  overflow-x: ${({ $vertical }) => ($vertical ? 'hidden' : 'auto')};
  overscroll-behavior: contain;
`
