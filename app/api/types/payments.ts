export interface Expense {
  id: number;
  name: string;
  amount: number;
  category: string;
  status: string;
}

export interface AdaptedExpenses {
  date: string;
  expenses: Expense[];
}

export interface CategoryExpense {
  id: number;
  name: string;
}
