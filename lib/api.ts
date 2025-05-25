import { getYear, getMonth, format, startOfMonth, endOfMonth } from "date-fns";
import { AdaptedExpenses } from '@/app/api/types/payments';
import { convertPayments } from '../app/api/adapters/payments.adapter';

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

// Types
export interface Expense {
  id?: number
  description: string
  amount: number
  dueDate: string
}
export async function getPayments(date: Date): Promise<AdaptedExpenses[]> {
  // const start = '22-11-2020';
  // const finish = '22-11-2025';

  const start = format(startOfMonth(date), "dd-MM-yyyy")
  const finish = format(endOfMonth(date), "dd-MM-yyyy")
  console.log("start", start)
  console.log("finish", finish)
  // const year = getYear(date);
  // const month = getMonth(date);

  // const startDate = new Date(year, month, 1);
  // const endDate = new Date(year, month + 1, 0);

  // const start = format(startDate, "dd-MM-yyyy");
  // const finish = format(endDate, "dd-MM-yyyy");

  const params = new URLSearchParams({ start, finsh: finish });
  const url = `/api/proxy/payment?${params.toString()}`;

  return fetch(url)
    .then(res => res.json())
    .then(res => {
      const response = convertPayments(res);
      // window.alert(`${JSON.stringify(response)}`);
      return response;
    });
}
// export async function getPayments(): Promise<void> {
//   const start = '22-11-2020';
//   const finish = '22-11-2025';

//   const params = new URLSearchParams({ start, finsh: finish });
//   const url = `/api/proxy/payment?${params.toString()}`;

//   await fetch(url)
//     .then(res => res.json())
//     .then(res => {

//       const response = convertPayments(res);

//       window.alert(`response: ${JSON.stringify(response)}`);
//     });
// }


export async function health(): Promise<void> {
  const url = '/api/proxy/payment/health';
  await fetch(url).then(res => res.json()).then(res => {
    const response = res.response

    window.alert(`RESPOSTA: ${JSON.stringify(response)}`)
  })
}



// API functions
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

export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/expenses`)
  console.log("aqui?? getExpenses")
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao buscar despesas")
  }

  return response.json()
}
