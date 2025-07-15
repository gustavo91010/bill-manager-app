"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdaptedExpenses } from "@/app/api/types/payments"

interface CalendarWidgetProps {
  expenses: AdaptedExpenses[]
  onMonthChange: (date: Date) => void
}

export function CalendarWidget({ expenses, onMonthChange }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Fix date handling to avoid timezone issues
  const getLocalDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const formatDateKey = (date: Date) => {
    // Use local date to avoid timezone shifts
    const localDate = getLocalDate(date)
    return localDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const hasExpensesOnDate = (day: number) => {
    if (!day) return false

    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateKey = formatDateKey(dateToCheck)

    return expenses.some((expense) => expense.date === dateKey)
  }

  const getExpenseCountForDate = (day: number) => {
    if (!day) return 0

    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateKey = formatDateKey(dateToCheck)

    const expenseGroup = expenses.find((expense) => expense.date === dateKey)
    return expenseGroup ? expenseGroup.expenses.length : 0
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    onMonthChange(newDate)
  }

  const isToday = (day: number) => {
    if (!day) return false
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth(currentDate).map((day, index) => {
          const hasExpenses = day ? hasExpensesOnDate(day) : false
          const expenseCount = day ? getExpenseCountForDate(day) : 0
          const todayClass = day && isToday(day) ? "bg-blue-500 text-white" : ""

          return (
            <div
              key={index}
              className={`
                relative p-2 text-sm min-h-[40px] flex items-center justify-center
                ${day ? "hover:bg-gray-100 cursor-pointer" : ""}
                ${todayClass}
                ${hasExpenses && day && !isToday(day) ? "bg-blue-50 border border-blue-200" : ""}
                rounded-md transition-colors
              `}
            >
              {day && (
                <>
                  <span className={todayClass ? "font-bold" : ""}>{day}</span>
                  {hasExpenses && (
                    <div
                      className={`
                      absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs
                      flex items-center justify-center font-bold
                      ${isToday(day) ? "bg-white text-blue-500" : "bg-blue-500 text-white"}
                    `}
                    >
                      {expenseCount}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Com pagamentos</span>
        </div>
      </div>
    </div>
  )
}
