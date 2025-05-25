import { getYear, getMonth, format, startOfMonth, endOfMonth } from "date-fns";
import { AdaptedExpenses } from '@/app/api/types/payments';
import { convertPayments } from '../app/api/adapters/payments.adapter';
import { Sumary } from "@/app/api/types/sumary";

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

// Types
export interface Expense {
  id?: number
  description: string
  amount: number
  dueDate: string
}
// API functions
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

export async function createExpense(expense: Expense): Promise<Expense> {
  console.log("aquicreateExpense getExpenses")
  console.log("API_BASE_URL " + API_BASE_URL)
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao criar despesa")
  }

  return response.json()
}

