"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, format, getMonth, getYear, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CalendarWidgetProps = {
  expenses: {
    date: string
    expenses: {
      id: number
      name: string
      amount: number
      category: string
      status: string
    }[]
  }[]
  onMonthChange?: (date: Date) => void
}

export function CalendarWidget({ expenses, onMonthChange }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const expenseDays = expenses.map((group) => {
    const day = Number.parseInt(group.date.split(" ")[0])
    return day
  })

  const daysInMonth = new Date(getYear(currentDate), getMonth(currentDate) + 1, 0).getDate()
  const firstDayOfMonth = new Date(getYear(currentDate), getMonth(currentDate), 1).getDay()

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate)
  }

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate)
  }

  const renderCalendarDays = () => {
    const days = []
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

    dayNames.forEach((day) => {
      days.push(
        <div key={`header-${day}`} className="flex h-8 w-8 items-center justify-center text-xs font-medium">
          {day}
        </div>,
      )
    })

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isExpenseDay = expenseDays.includes(day)
      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm",
            isExpenseDay && "bg-blue-500 text-white font-medium",
          )}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</div>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  )
}

