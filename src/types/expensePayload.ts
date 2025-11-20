export interface ExpensePayload {
  description: string;
  value: number;
  due_date: string; // formato "YYYY-MM-DD"
  periodicity: number;
}
