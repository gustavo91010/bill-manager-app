import { AdaptedExpenses, Expense } from "../types/payments";

export function convertPayments(response: any): AdaptedExpenses[] {
  const grouped: Record<string, Expense[]> = {};

  response.payments.forEach((p: any) => {
    // Cria a data e ajusta para o fuso horário local para evitar problemas de UTC
    const dateObj = new Date(p.due_date);
    const adjustedDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
    const date = adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    
    if (!grouped[date]) grouped[date] = [];

    const getDisplayStatus = (status: string): string => {
      switch (status.toLowerCase()) {
        case 'paid':
        case 'pago':
          return 'Pago';
        case 'overdue':
        case 'vencido':
          return 'Vencido';
        case 'due_soon':
        case 'a_vencer':
          return 'A Vencer';
        case 'due_today':
        case 'vencendo_hoje':
          return 'Vencendo Hoje';
        case 'pending':
        case 'pendente':
          return 'Pendente';
        case 'cancelled':
        case 'cancelado':
          return 'Cancelado';
        default:
          return status
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
      }
    };

    grouped[date].push({
      id: p.id,
      name: p.description || 'Sem descrição',
      amount: p.value,
      category: p.category || 'Sem categoria',
      status: getDisplayStatus(p.status),
    });
  });

  return Object.entries(grouped).map(([date, expenses]) => ({ date, expenses }));
}
