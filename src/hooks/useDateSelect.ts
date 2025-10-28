import { INITIAL_YEAR } from '@/lib/constants';
import { useEffect, useRef, useState } from 'react';

export default function useDateSelect() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const dateChangedBySelect = useRef(false);

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(Number.parseInt(newMonth))
    dateChangedBySelect.current = true;
  }

  const handleYearChange = (newYear: string) => {
    setSelectedYear(Number.parseInt(newYear))
    dateChangedBySelect.current = true;
  }

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      return setSelectedDate(undefined);
    }

    if (!dateChangedBySelect.current) {
      // Open photos page
    }

    setSelectedDate(date);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  useEffect(() => {
    const newDate = new Date()
    newDate.setDate(1)
    newDate.setFullYear(selectedYear);
    newDate.setMonth(selectedMonth);
    setSelectedDate(undefined)

    setSelectedDate(newDate);
    setCalendarDate(newDate)

  }, [selectedMonth, selectedYear, setSelectedDate])

  return {
    selectProps: {
      selectedMonth,
      selectedYear,
      onMonthChange(month: string) { handleMonthChange(month) },
      onYearChange(year: string) { handleYearChange(year) }
    },
    calendarProps: {
      selectedDate,
      calendarDate,
      setCalendarDate,
      handleDayPickerSelect
    }
  }
}