import { forwardRef, memo } from 'react'
import { isMobile } from 'react-device-detect'
import ScrollViewBrowser from './components/ScrollViewBrowser'
import ScrollViewMobile from './components/ScrollViewMobile'
import { SheetScrollViewProps } from './types'

const SheetScrollView = memo(
  forwardRef<HTMLDivElement, SheetScrollViewProps>((props, ref) => {
    if (isMobile) {
      return <ScrollViewMobile ref={ref} {...props} />
    }

    return <ScrollViewBrowser ref={ref} {...props} />
  })
)

type SheetScrollView = HTMLDivElement
SheetScrollView.displayName = 'SheetScrollView'
export default SheetScrollView
