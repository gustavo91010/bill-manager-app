import { AdaptedExpenses, Expense } from "../types/payments";

export function convertPayments(response: any): AdaptedExpenses[] {
  const grouped: Record<string, Expense[]> = {};

  response.payments.forEach((p: any) => {
    // Cria a data e ajusta para o fuso horário local para evitar problemas de UTC
    const dateObj = new Date(p.due_date);
    const adjustedDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
    const date = adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    
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
