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

// "use client"

// import { useState, useEffect } from "react"
// // import { useState } from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { addMonths, format, getMonth, getYear, subMonths } from "date-fns"
// import { ptBR } from "date-fns/locale"

// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { getPayments } from "@/lib/api"

// type CalendarWidgetProps = {
//   expenses: {
//     date: string
//     expenses: {
//       id: number
//       name: string
//       amount: number
//       category: string
//       status: string
//     }[]
//   }[]
// }

// export function CalendarWidget({ expenses }: CalendarWidgetProps) {
//   const [currentDate, setCurrentDate] = useState(new Date())

//   // Convert expense dates to day numbers for highlighting
//   const expenseDays = expenses.map((group) => {
//     // Extract day number from date string (e.g., "20 de Maio" -> 20)
//     const day = Number.parseInt(group.date.split(" ")[0])
//     return day
//   })

//   const daysInMonth = new Date(getYear(currentDate), getMonth(currentDate) + 1, 0).getDate()

//   const firstDayOfMonth = new Date(getYear(currentDate), getMonth(currentDate), 1).getDay()

//   // useEffect(() => {
//   //   async function fetchPayments() {
//   //     const payments = await getPayments(currentDate)
//   //     console.log("Pagamentos do mês:", payments)
//   //     // Aqui você pode salvar no state se quiser
//   //   }
//   //   fetchPayments()
//   // }, [currentDate])

//   // function onMonthChange(date: Date) {
//   //   getPayments(date)
//   // }
//   const handlePreviousMonth = () => {
//     setCurrentDate(subMonths(currentDate, 1))
//   }

//   const handleNextMonth = () => {
//     setCurrentDate(addMonths(currentDate, 1))
//   }

//   const renderCalendarDays = () => {
//     const days = []
//     // const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
//     const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
//     // Render day names
//     dayNames.forEach((day) => {
//       days.push(
//         <div key={`header-${day}`} className="flex h-8 w-8 items-center justify-center text-xs font-medium">
//           {day}
//         </div>,
//       )
//     })

//     // Empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
//     }

//     // Render days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const isExpenseDay = expenseDays.includes(day)
//       days.push(
//         <div
//           key={`day-${day}`}
//           className={cn(
//             "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm",
//             isExpenseDay && "bg-blue-500 text-white font-medium",
//           )}
//         >
//           {day}
//         </div>,
//       )
//     }

//     return days
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <div className="font-medium">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</div>
//         <Button variant="outline" size="icon" onClick={handleNextMonth}>
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//       <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
//     </div>
//   )
// }
