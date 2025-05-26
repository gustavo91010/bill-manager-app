import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { confirmPayment } from "@/lib/api"

type ExpenseItemProps = {
  expense: {
    id: number
    name: string
    amount: number
    category: string
    status: string
  }
}

// pagamento vencendo no dia
export function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
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
      <Button
        // onClick={() => console.log("Pagar", expense.id)}
        onClick={() => confirmPayment(expense.id)}
        className="self-end bg-blue-600 hover:bg-emerald-700"
      >
        pagar
      </Button>
    </div>
  )
}
