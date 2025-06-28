import { useState } from "react"
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
  onPaymentConfirmed: () => void
}
// pagamento vencendo no dia
export function ExpenseItem({ expense, onPaymentConfirmed }: ExpenseItemProps) {
  const [localExpense, setLocalExpense] = useState(expense)
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">{localExpense.name}</h4>
          <div className="text-sm text-muted-foreground">{localExpense.category}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-medium">R$ {localExpense.amount.toFixed(2)}</div>
          <Badge
            variant={localExpense.status.toLowerCase() === "pago" ? "outline" : "default"}
            className={cn(
              localExpense.status.toLowerCase() === "pago"
                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 border-green-300"
                : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 border-red-300",
              "capitalize",
            )}
          >
            {localExpense.status}
          </Badge>
        </div>
      </div>
      <Button

        onClick={async () => {
          try {
            const response = await confirmPayment(localExpense.id)
            // atualizando o localExpense, copiando os dados antigos e atualizando o status para aogo
            setLocalExpense({ ...localExpense, status: response.status })
            onPaymentConfirmed()
          } catch (error) {
            console.error("Erro ao confirmar pagamento:", error)
            alert("Falha ao confirmar pagamento. Tente novamente.")
          }
        }}

        className="self-end bg-blue-600 hover:bg-emerald-700"
      >
        pagar
      </Button>
    </div>
  )
}
