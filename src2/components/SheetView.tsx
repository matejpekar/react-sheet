import { HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef } from 'react'

const SheetView = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => (
    <motion.div ref={ref} layout {...props}>
      {children}
    </motion.div>
  )
)

SheetView.displayName = 'SheetView'
export default SheetView
