"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export default function TestCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    </div>
  )
}

