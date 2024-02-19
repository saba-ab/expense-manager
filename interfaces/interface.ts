export interface Expense {
  id?: number;
  cost: number;
  name: string;
  createdAt?: string;
}
export interface ExpenseParams {
  id: string;
}

export function isErrorWithCode(
  error: unknown
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
