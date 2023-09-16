import { motion } from 'framer-motion'
import { forwardRef, memo, useMemo } from 'react'
import styled from 'styled-components'
import { SheetScrollViewInternalProvider } from '../context'
import { SheetScrollViewProps } from '../types'

const BrowserScrollView = forwardRef<HTMLDivElement, SheetScrollViewProps>(
  ({ children }, ref) => {
    const contextVariables = useMemo(() => ({ scrollEnabled: true }), [])

    return (
      <SheetScrollViewInternalProvider value={contextVariables}>
        <ScrollableView ref={ref} layoutScroll>
          {children}
        </ScrollableView>
      </SheetScrollViewInternalProvider>
    )
  }
)

BrowserScrollView.displayName = 'BrowserScrollView'
export default memo(BrowserScrollView)

const ScrollableView = styled(motion.div)`
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: 100%;
  height: 100%;
`
