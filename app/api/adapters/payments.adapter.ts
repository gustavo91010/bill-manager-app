import { AdaptedExpenses, Expense } from "../types/payments";

export function convertPayments(response: any): AdaptedExpenses[] {
  const grouped: Record<string, Expense[]> = {};

  response.payments.forEach((p: any) => {
    const date = new Date(p.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    if (!grouped[date]) grouped[date] = [];

    grouped[date].push({
      id: p.id,
      name: p.description || 'Sem descrição',
      amount: p.value,
      category: 'Sem categoria',
      status: p.status.toLowerCase(),
    });
  });

  return Object.entries(grouped).map(([date, expenses]) => ({ date, expenses }));
}
