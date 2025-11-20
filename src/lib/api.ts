import { format, startOfMonth, endOfMonth } from "date-fns"
import { AdaptedExpenses } from "@/src/types/payments"
import { convertPayments } from "../adapters/payments.adapter"
import { Sumary } from "@/src/types/sumary"
import { ExpensePayload } from "@/src/types/expensePayload"

export interface Expense {
  id?: number
  description: string
  amount: number
  dueDate: string
  status: string
  repeat?: number
}
const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
// const jwtToken = localStorage.getItem('jwtToken')

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  const dataToSend = {
    ...userData,
    aplication: "bill-manager"
  };
  const response = await fetch(`${API_AUTH}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao registrar usuário");
  }

  const data = await response.json();
  return data; // objeto do usuário com access_token, aplication, roles etc
}


export async function loginWithToken(token: string) {
  const res = await fetch("/api/auth/token", {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Invalid token")
  const { accessToken } = await res.json()
  return accessToken
}

export async function loginWithEmailAndPassword(email: string, password: string) {
  const res = await fetch(`${API_AUTH}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Invalid credentials")

  return await res.json()
}


export async function authorizeToken(token: string) {
  const res = await fetch(`${API_AUTH}/users/authorization`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Token inválido");

  return await res.json();
}

export async function confirmPayment(expenseId: number, token: string): Promise<Expense> {
  const url = `${API_BASE}/payment/confirm-paymeny/${expenseId}`
  const jwtToken = localStorage.getItem('jwtToken') || "";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  })
  if (!response.ok) throw new Error("Erro ao confirmar pagamento.")
  const data = await response.json()
  return data.payment
}

export async function getSumary(date: Date): Promise<Sumary> {
  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")
  const params = new URLSearchParams({ start, finsh: finish })
  const url = `${API_BASE}/payment/sumary?${params.toString()}`
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) throw new Error("Erro ao buscar resumo")
  return res.json()
}

export async function getPayments(date: Date, token: string): Promise<AdaptedExpenses[]> {
  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")
  const params = new URLSearchParams({ start, finsh: finish })
  const url = `${API_BASE}/payment?${params.toString()}`

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Erro ao buscar pagamentos")
  const json = await res.json()
  return convertPayments(json)
}

export async function health(token: string): Promise<void> {
  const url = `${API_BASE}/payment/health`
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })
  const json = await res.json()
  alert(`RESPOSTA: ${JSON.stringify(json.response)}`)
}

export async function updateExpense(id: number, expense: ExpensePayload, token: string): Promise<Expense> {
  const jwtToken = localStorage.getItem('jwtToken') || "";
  const response = await fetch(`${API_BASE}/payment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
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
  const jwtToken = localStorage.getItem('jwtToken') || "";
  const repeat = expense.periodicity ?? 1
  const response = await fetch(`${API_BASE}/payment/repeat/${repeat}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
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
  const jwtToken = localStorage.getItem('jwtToken') || "";
  const url = `${API_BASE}/payment/${expenseId}`
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao excluir despesa")
  }
}
