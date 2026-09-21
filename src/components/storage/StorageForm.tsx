import { useEffect, useState } from "react";
import { X, Plus, Save } from "lucide-react";
import type { StoredItem, StorageCategory } from "../../types/storage";

interface StorageFormProps {
  editingItem: StoredItem | null;
  onSave: (item: StoredItem) => void;
  onClose: () => void;
}

const emptyForm = {
  name: "",
  category: "other" as StorageCategory,
  location: "",
  notes: "",
  isImportant: false,
};

const categories: { value: StorageCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "household", label: "Household" },
  { value: "other", label: "Other" },
];

function StorageForm({ editingItem, onSave, onClose }: StorageFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        category: editingItem.category,
        location: editingItem.location,
        notes: editingItem.notes,
        isImportant: editingItem.isImportant,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingItem]);

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.location.trim()) return;

    const now = new Date().toISOString();

    const item: StoredItem = {
      id: editingItem?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category,
      location: form.location.trim(),
      notes: form.notes.trim(),
      isImportant: form.isImportant,
      createdAt: editingItem?.createdAt ?? now,
      updatedAt: now,
    };

    onSave(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-purple-500">
              LifeTrack Storage
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#171020]">
              {editingItem ? "Edit stored item" : "Store something new"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Item name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Passport, winter jacket..."
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Where is it stored? *
            </label>
            <input
              required
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Bedroom → Top drawer"
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Be specific so you can find it later.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add details, access instructions, or reminders..."
              rows={3}
              className="w-full resize-none rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-amber-50 p-3">
            <input
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => updateField("isImportant", e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Mark as important
              </p>
              <p className="text-xs text-amber-700">
                Highlight this item for quick access.
              </p>
            </div>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#171020] px-4 py-3 text-sm font-medium text-white hover:bg-purple-900"
          >
            {editingItem ? <Save size={17} /> : <Plus size={17} />}
            {editingItem ? "Save changes" : "Save item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StorageForm;
