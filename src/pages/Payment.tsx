import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import PaymentCard from "../components/payments/PaymentCard";
import PaymentForm from "../components/payments/PaymentForm";
import type { Payment, PaymentStatus } from "../types/payment";

const STORAGE_KEY = "lifetrack_payments";

function getStatus(payment: Payment): PaymentStatus {
  if (payment.status === "paid") return "paid";

  if (
    payment.dueDate &&
    new Date(`${payment.dueDate}T23:59:59`).getTime() < Date.now()
  ) {
    return "overdue";
  }

  return "pending";
}

function Payments() {
  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<"all" | "pending" | "overdue" | "paid">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const stats = useMemo(() => {
    const pending = payments.filter((p) => getStatus(p) === "pending");
    const overdue = payments.filter((p) => getStatus(p) === "overdue");
    const paid = payments.filter((p) => getStatus(p) === "paid");

    return {
      total: payments.length,
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
      paidAmount: paid.reduce((sum, p) => sum + p.amount, 0),
      pendingCount: pending.length,
      overdueCount: overdue.length,
      paidCount: paid.length,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments
      .filter((payment) => {
        const status = getStatus(payment);
        return filter === "all" || status === filter;
      })
      .filter((payment) => {
        return [payment.title, payment.person, payment.notes]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        if (getStatus(a) === "paid" && getStatus(b) !== "paid") return 1;
        if (getStatus(a) !== "paid" && getStatus(b) === "paid") return -1;

        if (a.dueDate && b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }

        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [payments, filter, search]);

  function handleSave(payment: Payment) {
    setPayments((previous) => {
      const exists = previous.some((p) => p.id === payment.id);

      return exists
        ? previous.map((p) => (p.id === payment.id ? payment : p))
        : [payment, ...previous];
    });

    setShowForm(false);
    setEditingPayment(null);
  }

  function handleStatusChange(id: string, status: PaymentStatus) {
    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status,
              paidAt: status === "paid" ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            }
          : payment,
      ),
    );
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this payment?")) return;

    setPayments((previous) => previous.filter((p) => p.id !== id));
  }

  function openCreate() {
    setEditingPayment(null);
    setShowForm(true);
  }

  function openEdit(payment: Payment) {
    setEditingPayment(payment);
    setShowForm(true);
  }

  const filters = [
    { value: "all", label: "All", count: stats.total },
    { value: "pending", label: "Pending", count: stats.pendingCount },
    { value: "overdue", label: "Overdue", count: stats.overdueCount },
    { value: "paid", label: "History", count: stats.paidCount },
  ] as const;

  const formatMoney = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-pink-500">
            Keep your finances organized ✨
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#171020]">Payments</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track what you owe and what you're owed.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-black to-purple-600 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-purple-900"
        >
          <Plus size={18} />
          Add payment
        </button>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Pending payments"
          amount={stats.pendingAmount}
          subtitle={`${stats.pendingCount} pending`}
          icon={<Wallet size={21} />}
          color="bg-purple-100 text-purple-700"
        />

        <SummaryCard
          title="Overdue"
          amount={stats.overdueAmount}
          subtitle={`${stats.overdueCount} overdue`}
          icon={<Clock3 size={21} />}
          color="bg-pink-100 text-pink-700"
        />

        <SummaryCard
          title="Payment history"
          amount={stats.paidAmount}
          subtitle={`${stats.paidCount} completed`}
          icon={<CheckCircle2 size={21} />}
          color="bg-amber-100 text-amber-700"
        />
      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments..."
            className="w-full rounded-xl border border-purple-100 py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium ${
                filter === option.value
                  ? "bg-[#171020] text-white"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              {option.label}
              <span className="ml-1.5 opacity-70">{option.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Payment list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#171020]">
              {filter === "paid" ? "Payment history" : "Your payments"}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredPayments.length} payment(s)
            </p>
          </div>
        </div>

        {filteredPayments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onStatusChange={handleStatusChange}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
              <CreditCard size={27} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#171020]">
              No payments found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try another search term."
                : "Add your first payment to start tracking your finances."}
            </p>

            {!search && filter === "all" && (
              <button
                onClick={openCreate}
                className="mt-5 rounded-xl bg-[#171020] px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-900"
              >
                Add your first payment
              </button>
            )}
          </div>
        )}
      </section>

      {showForm && (
        <PaymentForm
          editingPayment={editingPayment}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

function SummaryCard({
  title,
  amount,
  subtitle,
  icon,
  color,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#171020]">
        ৳{amount.toLocaleString("en-BD")}
      </h3>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

export default Payments;
