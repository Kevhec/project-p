import { getItem, setItem } from "@/lib/localStorage"
import { useEffect, useRef, useState } from "react"

export default function useDateSelect() {
  const [selectedMonth, setSelectedMonth] = useState(
    getItem("select-month") || new Date().getMonth()
  )
  const [selectedYear, setSelectedYear] = useState(
    getItem("select-year") || new Date().getFullYear()
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const dateChangedBySelect = useRef(false)

  const calendarDate = new Date(selectedYear, selectedMonth, 1)

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(Number.parseInt(newMonth))
    setItem("select-month", newMonth)
    dateChangedBySelect.current = true
  }

  const handleYearChange = (newYear: string) => {
    setSelectedYear(Number.parseInt(newYear))
    setItem("select-year", newYear)
    dateChangedBySelect.current = true
  }

  const handleCalendarMonthChange = (date: Date) => {
    setSelectedMonth(date.getMonth())
    setSelectedYear(date.getFullYear())
  }

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      return setSelectedDate(undefined)
    }

    setSelectedMonth(date.getMonth())
    setSelectedYear(date.getFullYear())
  }

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, 1)
    setSelectedDate(newDate)
  }, [selectedMonth, selectedYear])

  return {
    selectProps: {
      selectedMonth,
      selectedYear,
      onMonthChange(month: string) {
        handleMonthChange(month)
      },
      onYearChange(year: string) {
        handleYearChange(year)
      },
    },
    calendarProps: {
      selected: selectedDate,
      month: calendarDate,
      onMonthChange: handleCalendarMonthChange,
      onSelect: handleDayPickerSelect,
    },
  }
}
