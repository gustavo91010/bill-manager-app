import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ExpenseItemProps = {
  expense: {
    id: number
    name: string
    amount: number
    category: string
    status: string
  }
}

export function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-1">
        <h4 className="font-medium">{expense.name}</h4>
        <div className="text-sm text-muted-foreground">{expense.category}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="font-medium">R$ {expense.amount.toFixed(2)}</div>
        <Badge
          variant={expense.status === "pago" ? "outline" : "default"}
          className={cn(
            expense.status === "pago"
              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 border-green-300"
              : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 border-red-300",
            "capitalize",
          )}
        >
          {expense.status}
        </Badge>
      </div>
    </div>
  )
}
