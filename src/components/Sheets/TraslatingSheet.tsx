import { motion, useTransform } from 'framer-motion'
import { memo } from 'react'
import styled from 'styled-components'
import { useSheet, useSheetInternal } from '../../hooks'
import { SheetsProps } from './types'

const TranslatingSheet = ({
  borderRadius,
  boxShadow,
  snapAnimationConfig,
  ...props
}: SheetsProps) => {
  const { height } = useSheet()
  const { highestSnapPoint, onPanStart, onPan, onPanEnd } = useSheetInternal()

  const y = useTransform(height, (latest) =>
    Math.max(highestSnapPoint - latest, 0)
  )
  const paddingBottom = useTransform(height, (latest) =>
    Math.max(latest - highestSnapPoint, 0)
  )

  return (
    <Container
      onPointerDown={onPanStart}
      onPan={(_, { offset }) => onPan(offset.y)}
      onPanEnd={(_, { velocity }) => onPanEnd(velocity.y)}
      exit={{ y: highestSnapPoint }}
      transition={snapAnimationConfig}
      style={{
        y,
        paddingBottom,
        borderRadius,
        boxShadow,
        height: highestSnapPoint,
      }}
      {...props}
    />
  )
}

export default memo(TranslatingSheet)

const Container = styled(motion.div)`
  position: absolute;
  overflow: hidden;
  touch-action: none;
  bottom: 0;
  width: 100%;
  background-color: gray;
`
