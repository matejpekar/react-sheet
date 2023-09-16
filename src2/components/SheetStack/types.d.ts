import type { ReactElement, ReactNode } from 'react'

export interface SheetStackProps {
  children?: ReactNode
}

export type SheetItem = {
  sheet: ReactElement
  id: string
}

export interface SheetStackVariables {
  sheetStack: SheetItem[]
  topSheetId: string | null
}

export interface SheetStackMethods {
  addSheet: (sheet: ReactElement, id: string) => void
  removeLastSheet: () => void
  removeAllSheets: () => void
}
