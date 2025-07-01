import { getYear, getMonth, format, startOfMonth, endOfMonth } from "date-fns";
import { AdaptedExpenses } from '@/app/api/types/payments';
import { convertPayments } from '../app/api/adapters/payments.adapter';
import { Sumary } from "@/app/api/types/sumary";
import { ExpensePayload } from "@/app/api/types/expensePayload";

// API configuration
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"
export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_API_BASE_URL || "ae3cbe27-cb95-40b2-b940-8d5624870101"

// Types
export interface Expense {
  id?: number
  description: string

  amount: number
  dueDate: string
  status: string
}
// API functions

export async function confirmPayment(expenseId: number): Promise<Expense> {
  console.log("confirmPayment expense id:", expenseId);

  const url = `/api/proxy/payment/confirm-paymeny/${expenseId}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.NEXT_PUBLIC_API_TOKEN!,
    },
  });

  console.log("res", response)
  if (!response.ok) {
    console.error('Erro ao confirmar pagamento');
    throw new Error('Erro ao confirmar pagamento.')
  } else {
    const data = await response.json()
    console.log('Pagamento confirmado com sucesso', data);
    return data.payment;
  }

}
export async function getSumary(date: Date): Promise<Sumary> {

  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")

  const params = new URLSearchParams({ start, finsh: finish });
  const url = `/api/proxy/payment/sumary?${params.toString()}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res as Sumary)
    .then(res => {

      return res;
    });

}

export async function getPayments(date: Date): Promise<AdaptedExpenses[]> {

  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")

  const params = new URLSearchParams({ start, finsh: finish });
  const url = `/api/proxy/payment?${params.toString()}`;

  return fetch(url)
    .then(res => res.json())
    .then(res => {
      const response = convertPayments(res);
      return response;
    });
}
export async function health(): Promise<void> {
  const url = '/api/proxy/payment/health';
  await fetch(url).then(res => res.json()).then(res => {
    const response = res.response

    window.alert(`RESPOSTA: ${JSON.stringify(response)}`)
  })
}

// export async function updateExpense(expense: ExpensePayload): Promise<Expense> 
export async function updateExpense(id: number, expense: ExpensePayload): Promise<Expense> {

  const response = await fetch(`/api/proxy/payment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': process.env.NEXT_PUBLIC_API_TOKEN!,
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao atualizar despesa");
  }

  return response.json();
}

export async function createExpense(expense: ExpensePayload): Promise<Expense> {
  console.log("createExpense chamado com:", expense);

  const response = await fetch(`/api/proxy/payment/repeat/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar despesa");
  }

  return response.json();
}

