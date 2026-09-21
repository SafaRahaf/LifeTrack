export type PaymentStatus = "pending" | "paid" | "overdue";

export type PaymentDirection = "owe" | "receive";

export interface Payment {
  id: string;
  title: string;
  person: string;
  amount: number;
  direction: PaymentDirection;
  dueDate: string;
  notes: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}
