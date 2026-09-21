import { useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FolderOpen,
  Package,
  Plus,
  Star,
  Target,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import type { Payment } from "../types/payment";
import type { StoredItem } from "../types/storage";
import type { Task } from "../types/task";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const TASKS_KEY = "lifetrack_tasks";
const STORAGE_KEY = "lifetrack_storage_items";
const PAYMENTS_KEY = "lifetrack_payments";

function readStorage<T>(key: string): T[] {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function formatAmount(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(date: string) {
  if (!date) return "No date";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTaskStatus(task: Task) {
  if (task.status === "completed") return "completed";

  if (
    task.dueDate &&
    new Date(`${task.dueDate}T23:59:59`).getTime() < Date.now()
  ) {
    return "overdue";
  }

  return task.status;
}

function getPaymentStatus(payment: Payment) {
  if (payment.status === "paid") return "paid";

  if (new Date(`${payment.dueDate}T23:59:59`).getTime() < Date.now()) {
    return "overdue";
  }

  return "pending";
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const tasks = useMemo(() => readStorage<Task>(TASKS_KEY), []);
  const storedItems = useMemo(() => readStorage<StoredItem>(STORAGE_KEY), []);
  const payments = useMemo(() => readStorage<Payment>(PAYMENTS_KEY), []);

  const taskStats = useMemo(() => {
    const completed = tasks.filter(
      (task) => getTaskStatus(task) === "completed",
    ).length;

    const overdue = tasks.filter(
      (task) => getTaskStatus(task) === "overdue",
    ).length;

    return {
      total: tasks.length,
      completed,
      overdue,
      completionRate: tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0,
    };
  }, [tasks]);

  const paymentStats = useMemo(() => {
    const pending = payments.filter(
      (payment) => getPaymentStatus(payment) === "pending",
    );

    const overdue = payments.filter(
      (payment) => getPaymentStatus(payment) === "overdue",
    );

    const paid = payments.filter(
      (payment) => getPaymentStatus(payment) === "paid",
    );

    const owed = payments
      .filter(
        (payment) =>
          payment.direction === "owe" && getPaymentStatus(payment) !== "paid",
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

    const receivable = payments
      .filter(
        (payment) =>
          payment.direction === "receive" &&
          getPaymentStatus(payment) !== "paid",
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      pendingCount: pending.length,
      overdueCount: overdue.length,
      paidCount: paid.length,
      owed,
      receivable,
    };
  }, [payments]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => getTaskStatus(task) !== "completed")
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return a.dueDate.localeCompare(b.dueDate);
      })
      .slice(0, 5);
  }, [tasks]);

  const importantItems = storedItems
    .filter((item) => item.isImportant)
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="min-h-full space-y-8 bg-[#f7f5ef] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black to-purple-600 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-[#d4af37]">
              Your personal command center
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back to <span className="text-[#d4af37]">LifeTrack</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Keep your tasks, belongings, and financial responsibilities
              organized in one place.
            </p>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-[#d4af37]/40 bg-[#d4af37]/10">
            <Target className="h-12 w-12 text-[#d4af37]" />
          </div>
        </div>
      </section>

      {/* Main statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          subtitle={`${taskStats.completed} completed`}
          icon={<CheckCircle2 />}
          accent="gold"
        />

        <StatCard
          title="Stored Items"
          value={storedItems.length}
          subtitle={`${storedItems.filter((item) => item.isImportant).length} important items`}
          icon={<Package />}
          accent="black"
        />

        <StatCard
          title="Pending Payments"
          value={paymentStats.pendingCount}
          subtitle={`${paymentStats.overdueCount} overdue`}
          icon={<Clock3 />}
          accent="gold"
        />

        <StatCard
          title="Task Completion"
          value={`${taskStats.completionRate}%`}
          subtitle={`${taskStats.overdue} overdue tasks`}
          icon={<Target />}
          accent="black"
        />
      </section>

      {/* Financial overview */}
      <section>
        <SectionHeading
          icon={<Wallet />}
          title="Financial Overview"
          subtitle="Track what you owe and what you should receive"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-r from-black to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total money owed</p>
                <h2 className="mt-2 text-3xl font-black text-[#d4af37]">
                  {formatAmount(paymentStats.owed)}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <ArrowUpRight className="h-7 w-7 text-[#d4af37]" />
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("payments")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-[#d4af37]"
            >
              View payments
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-3xl border border-[#d4af37]/40 bg-[#fffdf5] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/55">Total to receive</p>
                <h2 className="mt-2 text-3xl font-black text-black">
                  {formatAmount(paymentStats.receivable)}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#d4af37]/20 p-3">
                <ArrowDownLeft className="h-7 w-7 text-black" />
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("payments")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black transition hover:text-[#a17c00]"
            >
              Manage receivables
              <ArrowDownLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Content columns */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Upcoming tasks */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <SectionHeading
              icon={<CheckCircle2 />}
              title="Upcoming Tasks"
              subtitle="Things that need your attention"
            />

            <button
              onClick={() => onNavigate?.("tasks")}
              className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
            >
              View all
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <EmptyState message="No upcoming tasks." />
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const status = getTaskStatus(task);

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-black">
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-black/50">
                        {task.dueDate
                          ? `Due ${formatDate(task.dueDate)}`
                          : "No deadline"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : status === "in-progress"
                            ? "bg-[#d4af37]/20 text-black"
                            : "bg-black text-[#d4af37]"
                      }`}
                    >
                      {status === "in-progress"
                        ? "In progress"
                        : status === "overdue"
                          ? "Overdue"
                          : "To do"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Important storage items */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <SectionHeading
              icon={<FolderOpen />}
              title="Important Items"
              subtitle="Things you marked as important"
            />

            <button
              onClick={() => onNavigate?.("storage")}
              className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
            >
              View all
            </button>
          </div>

          {importantItems.length === 0 ? (
            <EmptyState message="No important items yet." />
          ) : (
            <div className="space-y-3">
              {importantItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-black/10 p-3"
                >
                  <div className="rounded-xl bg-black p-3">
                    <Package className="h-5 w-5 text-[#d4af37]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-black">{item.name}</p>

                    <p className="mt-1 truncate text-xs text-black/50">
                      {item.location}
                    </p>
                  </div>

                  <Star className="h-5 w-5 shrink-0 fill-[#d4af37] text-[#d4af37]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent payments */}
      <section className="rounded-3xl bg-gradient-to-r from-black to-purple-600 p-5 text-white shadow-xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SectionHeading
            icon={<CreditCard />}
            title="Recent Payments"
            subtitle="Your latest payment activity"
            dark
          />

          <button
            onClick={() => onNavigate?.("payments")}
            className="rounded-xl border border-[#d4af37]/50 px-3 py-2 text-xs font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
          >
            View history
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <p className="rounded-2xl border border-white/10 p-5 text-sm text-white/50">
            No payment activity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentPayments.map((payment) => {
              const status = getPaymentStatus(payment);
              const isReceiving = payment.direction === "receive";

              return (
                <div
                  key={payment.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/10 p-3">
                      {isReceiving ? (
                        <ArrowDownLeft className="h-5 w-5 text-[#d4af37]" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-[#d4af37]" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold">{payment.title}</p>
                      <p className="mt-1 text-xs text-white/50">
                        {payment.person || "No person specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p
                      className={`font-black ${
                        isReceiving ? "text-[#d4af37]" : "text-white"
                      }`}
                    >
                      {isReceiving ? "+" : "-"}
                      {formatAmount(payment.amount)}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        status === "paid"
                          ? "bg-emerald-400/20 text-emerald-300"
                          : status === "overdue"
                            ? "bg-red-400/20 text-red-300"
                            : "bg-[#d4af37]/20 text-[#d4af37]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="rounded-3xl border border-[#d4af37]/50 bg-[#fffdf5] p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a17c00]">
            Stay organized
          </p>

          <h2 className="mt-1 text-2xl font-black text-black">Quick Actions</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <QuickAction
            label="Add Task"
            icon={<Plus />}
            onClick={() => onNavigate?.("tasks")}
          />

          <QuickAction
            label="Save an Item"
            icon={<Package />}
            onClick={() => onNavigate?.("storage")}
          />

          <QuickAction
            label="Add Payment"
            icon={<CircleDollarSign />}
            onClick={() => onNavigate?.("payments")}
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`rounded-xl p-2 ${
          dark ? "bg-white/10 text-[#d4af37]" : "bg-black text-[#d4af37]"
        }`}
      >
        {icon}
      </div>

      <div>
        <h2
          className={`text-lg font-black ${dark ? "text-white" : "text-black"}`}
        >
          {title}
        </h2>

        <p
          className={`mt-1 text-xs ${dark ? "text-white/50" : "text-black/50"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accent: "gold" | "black";
}) {
  return (
    <div className="group rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-black/50">{title}</p>
          <h2 className="mt-2 text-3xl font-black text-black">{value}</h2>
          <p className="mt-2 text-xs text-black/50">{subtitle}</p>
        </div>

        <div
          className={`rounded-2xl p-3 ${
            accent === "gold"
              ? "bg-[#d4af37]/20 text-[#a17c00]"
              : "bg-black text-[#d4af37]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 p-6 text-center text-sm text-black/45">
      {message}
    </div>
  );
}

function QuickAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl bg-pink-50 px-4 py-4 text-sm font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
    >
      {icon}
      {label}
    </button>
  );
}
