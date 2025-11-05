import type { DocumentDataType } from "@/types/general"
import { useContext } from "react"
import { createContext } from "react"

interface PicturesContextType {
  loading: boolean
  selectedDate: Date | undefined
  monthData: DocumentDataType[]
  changeDate: (newDate: Date) => void
  getMonthData: (date: Date) => void
  handleLoading: (newLoading: boolean) => void
}

const PicturesContext = createContext<PicturesContextType>({
  loading: false,
  selectedDate: new Date(),
  monthData: [],
  changeDate: () => null,
  getMonthData: () => null,
  handleLoading: () => null,
})

function usePictures() {
  const context = useContext(PicturesContext)

  if (!context) {
    throw new Error("usePictures must be use within a PicturesProvider")
  }

  return context
}

export { PicturesContext, usePictures }
