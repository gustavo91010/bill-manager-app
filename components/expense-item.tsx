import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { confirmPayment } from "@/lib/api"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ExpenseItemProps = {
  expense: {
    id: number
    name: string
    amount: number
    category: string
    status: string
  }
  onPaymentConfirmed: () => void
  onEdit: (expense: any) => void
  onDelete: (expenseId: number) => void
}

export function ExpenseItem({ expense, onPaymentConfirmed, onEdit, onDelete }: ExpenseItemProps) {
  const [localExpense, setLocalExpense] = useState(expense)

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-1 max-w-xs">
        <h4 className="font-medium truncate">{localExpense.name}</h4>
        <div className="text-sm text-muted-foreground truncate">{localExpense.category}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-medium whitespace-nowrap">R$ {localExpense.amount.toFixed(2)}</div>

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

        <Button
          onClick={async () => {
            try {
              const response = await confirmPayment(localExpense.id)
              setLocalExpense({ ...localExpense, status: response.status })
              onPaymentConfirmed()
            } catch (error) {
              alert("Falha ao confirmar pagamento. Tente novamente.")
            }
          }}
          variant={localExpense.status.toLowerCase() === "pago" ? "outline" : "default"}
          size="sm"
          className="whitespace-nowrap"
          disabled={localExpense.status.toLowerCase() === "pago"}
        >
          pagar
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(localExpense)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(localExpense.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Deletar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
