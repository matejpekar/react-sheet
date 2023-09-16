import { HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef, memo } from 'react'

const SheetView = memo(
  forwardRef<HTMLDivElement, Omit<HTMLMotionProps<'div'>, 'layout'>>(
    (props, ref) => <motion.div ref={ref} layout {...props} />
  )
)

SheetView.displayName = 'SheetView'
type SheetView = HTMLDivElement
export default SheetView
