import { forwardRef, memo } from 'react'
import { isMobile } from 'react-device-detect'
import { useSheetInternal } from '../../hooks'
import BrowserScrollView from './components/BrowserScrollView'
import ResizingScrollView from './components/ResizingScrollView'
import TranslatingScrollView from './components/TranslatingScrollView'
import { DEFAULT_SCROLL_THRESHOLD } from './constants'
import type { SheetScrollViewProps } from './types'

const SheetScrollView = memo(
  forwardRef<HTMLDivElement, SheetScrollViewProps>((props, ref) => {
    const { type } = useSheetInternal()

    if (!isMobile) {
      return <BrowserScrollView ref={ref} {...props} />
    }

    switch (type) {
      case 'translating':
        return <TranslatingScrollView ref={ref} {...props} />
      case 'resizing':
        return <ResizingScrollView ref={ref} {...props} />
    }
  })
)

type SheetScrollView = HTMLDivElement
SheetScrollView.displayName = 'SheetScrollView'
export default SheetScrollView
