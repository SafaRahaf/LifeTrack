import { useEffect, useState } from "react";
import { X, Plus, Save } from "lucide-react";
import type { Payment, PaymentDirection } from "../../types/payment";

interface PaymentFormProps {
  editingPayment: Payment | null;
  onSave: (payment: Payment) => void;
  onClose: () => void;
}

const emptyForm = {
  title: "",
  person: "",
  amount: "",
  direction: "owe" as PaymentDirection,
  dueDate: "",
  notes: "",
};

function PaymentForm({ editingPayment, onSave, onClose }: PaymentFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingPayment) {
      setForm({
        title: editingPayment.title,
        person: editingPayment.person,
        amount: String(editingPayment.amount),
        direction: editingPayment.direction,
        dueDate: editingPayment.dueDate,
        notes: editingPayment.notes,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingPayment]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim() || !form.amount || amount <= 0) return;

    const now = new Date().toISOString();

    const payment: Payment = {
      id: editingPayment?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      person: form.person.trim(),
      amount,
      direction: form.direction,
      dueDate: form.dueDate,
      notes: form.notes.trim(),
      status: editingPayment?.status ?? "pending",
      paidAt: editingPayment?.paidAt ?? null,
      createdAt: editingPayment?.createdAt ?? now,
      updatedAt: now,
    };

    onSave(payment);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-pink-500">
              LifeTrack Finance
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#171020]">
              {editingPayment ? "Edit payment" : "Add a payment"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Payment title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Internet bill"
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Amount (৳) *
              </label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                placeholder="2500"
                className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Person / Company
              </label>
              <input
                value={form.person}
                onChange={(e) => updateField("person", e.target.value)}
                placeholder="e.g. ISP provider"
                className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Payment type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField("direction", "owe")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  form.direction === "owe"
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-purple-100 text-gray-500"
                }`}
              >
                I need to pay
              </button>

              <button
                type="button"
                onClick={() => updateField("direction", "receive")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  form.direction === "receive"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-purple-100 text-gray-500"
                }`}
              >
                I need to receive
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add payment details..."
              rows={3}
              className="w-full resize-none rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#171020] px-4 py-3 text-sm font-medium text-white hover:bg-purple-900"
          >
            {editingPayment ? <Save size={17} /> : <Plus size={17} />}
            {editingPayment ? "Save changes" : "Add payment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;
