import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { PicturesContext } from "./picturesContext"
import debounce from "just-debounce-it"
import { queryMonth } from "@/lib/databaseOperations"
import { format } from "date-fns"
import type { DocumentDataType } from "@/types/general"

export default function PicturesProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [monthData, setMonthData] = useState<DocumentDataType[]>([])

  const getMonthData = useMemo(
    () =>
      debounce(async (date: Date) => {
        setLoading(true)
        try {
          const monthId = format(date, "MMyyyy")
          const newMonthData = await queryMonth(monthId)
          setMonthData(newMonthData)
        } catch (error) {
          throw new Error(String(error))
        } finally {
          setLoading(false)
        }
      }, 500),
    []
  )

  const handleLoading = useCallback((newLoading: boolean) => {
    setLoading(newLoading)
  }, [])

  const changeDate = useCallback((newDate: Date) => {
    setSelectedDate(newDate)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      getMonthData(selectedDate)
    }
  }, [selectedDate, getMonthData])

  const value = useMemo(
    () => ({
      loading,
      selectedDate,
      monthData,
      getMonthData,
      changeDate,
      handleLoading,
    }),
    [loading, selectedDate, monthData, getMonthData, changeDate, handleLoading]
  )

  return (
    <PicturesContext.Provider value={value}>
      {children}
    </PicturesContext.Provider>
  )
}
