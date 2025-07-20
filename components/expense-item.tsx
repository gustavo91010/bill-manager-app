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
    <div className="flex flex-col sm:flex-row justify-between gap-2 rounded-lg border p-3">
      {/* Linha Superior (Mobile) ou Linha Única (Desktop) */}
      <div className="flex flex-1 min-w-0 items-start sm:items-center gap-3">
        {/* Nome e Categoria */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate text-base">
            {localExpense.name}
          </h4>
          <div className="sm:hidden text-sm text-muted-foreground truncate mt-1">
            {localExpense.category}
          </div>
        </div>

        {/* Valor - Alinhado à direita e centralizado verticalmente */}
        <div className="font-medium whitespace-nowrap min-w-[85px] text-right sm:text-left">
          R$ {localExpense.amount.toFixed(2)}
        </div>
      </div>

      {/* Linha Inferior (Mobile) ou Continuação (Desktop) */}
      <div className="flex items-center justify-between sm:justify-normal gap-2">
        {/* Categoria (apenas desktop) */}
        <div className="hidden sm:block text-sm text-muted-foreground truncate min-w-[100px]">
          {localExpense.category}
        </div>

        {/* Status e Ações */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <Badge
            variant={localExpense.status.toLowerCase() === "pago" ? "outline" : "default"}
            className={cn(
              localExpense.status.toLowerCase() === "pago"
                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 border-green-300"
                : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 border-red-300",
              "capitalize text-xs sm:text-sm"
            )}
          >
            {localExpense.status}
          </Badge>

          <Button
            onClick={async () => {
              try {
                const response = await confirmPayment(localExpense.id, localStorage.getItem("accessToken") ?? "")
                setLocalExpense({ ...localExpense, status: response.status })
                onPaymentConfirmed()
              } catch (error) {
                alert("Falha ao confirmar pagamento. Tente novamente.")
              }
            }}
            variant={localExpense.status.toLowerCase() === "pago" ? "outline" : "default"}
            size="sm"
            className="whitespace-nowrap text-xs sm:text-sm"
            disabled={localExpense.status.toLowerCase() === "pago"}
          >
            pagar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
    </div>
  )
}