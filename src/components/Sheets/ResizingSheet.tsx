import { motion } from 'framer-motion'
import { memo } from 'react'
import styled from 'styled-components'
import { useSheet, useSheetInternal } from '../../hooks'
import { SheetsProps } from './types'

const ResizingSheet = ({
  snapAnimationConfig,
  borderRadius,
  boxShadow,
  ...props
}: SheetsProps) => {
  const { height } = useSheet()
  const { onPanStart, onPan, onPanEnd } = useSheetInternal()

  return (
    <Container
      layout="size"
      layoutRoot
      layoutDependency={height}
      onPointerDown={onPanStart}
      onPan={(_, { offset }) => onPan(offset.y)}
      onPanEnd={(_, { velocity }) => onPanEnd(velocity.y)}
      exit={{ height: 0 }}
      transition={snapAnimationConfig}
      style={{
        height,
        borderRadius, // has to be here
        boxShadow, // has to be here
      }}
      {...props}
    />
  )
}

export default memo(ResizingSheet)

const Container = styled(motion.div)`
  position: absolute;
  overflow: hidden;
  touch-action: none;
  bottom: 0;
  width: 100%;
  background-color: gray;
`
