import {
  CheckCircle2,
  Clock3,
  Edit3,
  Trash2,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import type { Payment, PaymentStatus } from "../../types/payment";

interface PaymentCardProps {
  payment: Payment;
  onStatusChange: (id: string, status: PaymentStatus) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

function getPaymentStatus(payment: Payment): PaymentStatus {
  if (payment.status === "paid") return "paid";

  if (
    payment.dueDate &&
    new Date(`${payment.dueDate}T23:59:59`).getTime() < Date.now()
  ) {
    return "overdue";
  }

  return "pending";
}

function PaymentCard({
  payment,
  onStatusChange,
  onEdit,
  onDelete,
}: PaymentCardProps) {
  const status = getPaymentStatus(payment);
  const isPaid = status === "paid";
  const isOverdue = status === "overdue";

  const money = `${payment.direction === "owe" ? "-" : "+"}৳${payment.amount.toLocaleString()}`;

  return (
    <article className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              payment.direction === "owe"
                ? "bg-pink-100 text-pink-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {payment.direction === "owe" ? (
              <ArrowUpRight size={23} />
            ) : (
              <ArrowDownLeft size={23} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-[#171020]">
              {payment.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {payment.person || "No person specified"}
            </p>
          </div>
        </div>

        <p
          className={`shrink-0 text-lg font-bold ${
            payment.direction === "owe" ? "text-pink-600" : "text-purple-600"
          }`}
        >
          {money}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isPaid
              ? "bg-green-100 text-green-700"
              : isOverdue
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
        </span>

        {payment.dueDate && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock3 size={14} />
            {isPaid
              ? `Paid ${payment.paidAt?.slice(0, 10) ?? ""}`
              : `Due ${payment.dueDate}`}
          </span>
        )}
      </div>

      {payment.notes && (
        <p className="mt-3 whitespace-pre-wrap text-sm text-gray-500 w-[calc(100%-1rem)] line-clamp-3">
          {payment.notes}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
        {!isPaid ? (
          <button
            onClick={() => onStatusChange(payment.id, "paid")}
            className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2.5 text-xs font-medium text-green-700 hover:bg-green-100"
          >
            <CheckCircle2 size={15} />
            Mark paid
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(payment.id, "pending")}
            className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
          >
            <RotateCcw size={15} />
            Reopen
          </button>
        )}

        <button
          onClick={() => onEdit(payment)}
          className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-purple-50"
        >
          <Edit3 size={15} />
          Edit
        </button>

        <button
          onClick={() => onDelete(payment.id)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default PaymentCard;
