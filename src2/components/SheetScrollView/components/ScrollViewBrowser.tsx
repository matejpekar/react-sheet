import { motion } from 'framer-motion'
import React, { forwardRef, memo, useMemo } from 'react'
import styled from 'styled-components'
import { SheetScrollViewInternalProvider } from '../context'
import { SheetScrollViewProps } from '../types'

const ScrollViewBrowser = forwardRef<HTMLDivElement, SheetScrollViewProps>(
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

ScrollViewBrowser.displayName = 'ScrollViewBrowser'
export default memo(ScrollViewBrowser)

const ScrollableView = styled(motion.div)`
  overflow: auto;
  overscroll-behavior: contain;
  width: 100%;
  height: 100%;
`
