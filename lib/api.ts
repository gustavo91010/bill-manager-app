import { format, startOfMonth, endOfMonth } from "date-fns"
import { AdaptedExpenses } from "@/app/api/types/payments"
import { convertPayments } from "@/app/api/adapters/payments.adapter"
import { Sumary } from "@/app/api/types/sumary"
import { ExpensePayload } from "@/app/api/types/expensePayload"

export interface Expense {
  id?: number
  description: string
  amount: number
  dueDate: string
  status: string
  repeat?: number
}

export async function confirmPayment(expenseId: number, token: string): Promise<Expense> {
  const url = `/api/proxy/payment/confirm-payment/${expenseId}`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
  if (!response.ok) throw new Error("Erro ao confirmar pagamento.")
  const data = await response.json()
  return data.payment
}

export async function getSumary(date: Date, token: string): Promise<Sumary> {
  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")
  const params = new URLSearchParams({ start, finsh: finish })
  const url = `/api/proxy/payment/sumary?${params.toString()}`

  const res = await fetch(url, {
    headers: { Authorization: token },
  })
  if (!res.ok) throw new Error("Erro ao buscar resumo")
  return res.json()
}

export async function getPayments(date: Date, token: string): Promise<AdaptedExpenses[]> {
  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")
  const params = new URLSearchParams({ start, finsh: finish })
  const url = `/api/proxy/payment?${params.toString()}`

  const res = await fetch(url, {
    headers: { Authorization: token },
  })
  if (!res.ok) throw new Error("Erro ao buscar pagamentos")
  const json = await res.json()
  return convertPayments(json)
}

export async function health(token: string): Promise<void> {
  const url = "/api/proxy/payment/health"
  const res = await fetch(url, {
    headers: { Authorization: token },
  })
  const json = await res.json()
  alert(`RESPOSTA: ${JSON.stringify(json.response)}`)
}

export async function updateExpense(id: number, expense: ExpensePayload, token: string): Promise<Expense> {
  const response = await fetch(`/api/proxy/payment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao atualizar despesa")
  }
  return response.json()
}

export async function createExpense(expense: ExpensePayload, token: string): Promise<Expense> {
  const repeat = expense.periodicity ?? 1
  const response = await fetch(`/api/proxy/payment/repeat/${repeat}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao criar despesa")
  }
  return response.json()
}

export async function deleteExpense(expenseId: number, token: string): Promise<void> {
  const url = `/api/proxy/payment/${expenseId}`
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao excluir despesa")
  }
}
