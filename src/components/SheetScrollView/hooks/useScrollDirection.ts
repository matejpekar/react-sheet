import { RefObject, useEffect, useRef, useState } from 'react'

export const useScrollDirection = (ref: RefObject<HTMLDivElement>) => {
  const [direction, setDirection] = useState<'up' | 'down' | 'still'>('still')
  const prev = useRef(ref.current?.scrollTop)

  useEffect(() => {
    const element = ref.current

    const handle = () => {
      if (!prev.current || !element || prev.current === element.scrollTop) {
        setDirection('still')
      } else if (prev.current! < element.scrollTop) {
        setDirection('down')
      } else {
        setDirection('up')
      }

      if (element) {
        prev.current = element.scrollTop
      }
    }

    element?.addEventListener('scroll', handle)

    return () => element?.removeEventListener('scroll', handle)
  }, [ref])

  return direction
}
