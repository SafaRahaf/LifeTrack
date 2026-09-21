import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  FolderOpen,
  MapPin,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import StorageCard from "../components/storage/StorageCard";
import StorageForm from "../components/storage/StorageForm";
import type { StoredItem, StorageCategory } from "../types/storage";

const STORAGE_KEY = "lifetrack_storage_items";

const initialItems: StoredItem[] = [
  {
    id: "storage-demo-1",
    name: "Passport",
    category: "documents",
    location: "Bedroom → Top drawer",
    notes: "Keep it in the protective cover.",
    isImportant: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "storage-demo-2",
    name: "Winter jacket",
    category: "clothing",
    location: "Wardrobe → Upper shelf",
    notes: "Stored inside the black storage bag.",
    isImportant: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "storage-demo-3",
    name: "Spare charging cable",
    category: "electronics",
    location: "Desk → Cable organizer",
    notes: "USB-C cable.",
    isImportant: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories: { value: StorageCategory | "all"; label: string }[] = [
  { value: "all", label: "All items" },
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "household", label: "Household" },
  { value: "other", label: "Other" },
];

function Storage() {
  const [items, setItems] = useState<StoredItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return initialItems;

      const parsed: unknown = JSON.parse(saved);

      return Array.isArray(parsed) ? (parsed as StoredItem[]) : initialItems;
    } catch {
      return initialItems;
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StorageCategory | "all">("all");
  const [importantOnly, setImportantOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StoredItem | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const stats = useMemo(() => {
    const locations = new Set(
      items.map((item) => item.location.trim().toLowerCase()).filter(Boolean),
    );

    return {
      total: items.length,
      important: items.filter((item) => item.isImportant).length,
      categories: new Set(items.map((item) => item.category)).size,
      locations: locations.size,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => category === "all" || item.category === category)
      .filter((item) => !importantOnly || item.isImportant)
      .filter((item) => {
        if (!query) return true;

        return [item.name, item.location, item.notes, item.category].some(
          (value) => value.toLowerCase().includes(query),
        );
      })
      .sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
          return Number(b.isImportant) - Number(a.isImportant);
        }

        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [items, search, category, importantOnly]);

  function handleSave(item: StoredItem) {
    setItems((previous) => {
      const exists = previous.some((entry) => entry.id === item.id);

      return exists
        ? previous.map((entry) => (entry.id === item.id ? item : entry))
        : [item, ...previous];
    });

    setShowForm(false);
    setEditingItem(null);
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item?",
    );

    if (!confirmed) return;

    setItems((previous) => previous.filter((item) => item.id !== id));
  }

  function handleClearAll() {
    if (!items.length) return;

    const confirmed = window.confirm(
      "Delete every stored item? This cannot be undone.",
    );

    if (confirmed) setItems([]);
  }

  function openCreateForm() {
    setEditingItem(null);
    setShowForm(true);
  }

  function openEditForm(item: StoredItem) {
    setEditingItem(item);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-purple-500">
            Never lose track again ✨
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#171020]">My storage</h1>
          <p className="mt-2 text-sm text-gray-500">
            Remember where you put everything.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-black to-purple-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-purple-900"
        >
          <Plus size={18} />
          Add item
        </button>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Total items"
          value={stats.total}
          icon={<Package size={20} />}
          color="bg-purple-100 text-purple-700"
        />
        <SummaryCard
          label="Important"
          value={stats.important}
          icon={<Star size={20} />}
          color="bg-amber-100 text-amber-700"
        />
        <SummaryCard
          label="Categories"
          value={stats.categories}
          icon={<FolderOpen size={20} />}
          color="bg-pink-100 text-pink-700"
        />
        <SummaryCard
          label="Locations"
          value={stats.locations}
          icon={<MapPin size={20} />}
          color="bg-violet-100 text-violet-700"
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
            placeholder="Search items, locations, or notes..."
            className="w-full rounded-xl border border-purple-100 py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value)}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
                category === option.value
                  ? "bg-[#171020] text-white"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              {option.label}
            </button>
          ))}

          <button
            onClick={() => setImportantOnly((value) => !value)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition ${
              importantOnly
                ? "bg-amber-400 text-amber-950"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            <Star size={14} />
            Important only
          </button>
        </div>
      </section>

      {/* Items */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#171020]">Your items</h2>
            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <StorageCard
                key={item.id}
                item={item}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
              <Archive size={27} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#171020]">
              No items found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {search || importantOnly || category !== "all"
                ? "Try changing your search or filters."
                : "Add your first item to start organizing your belongings."}
            </p>

            {!search && !importantOnly && category === "all" && (
              <button
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-[#171020] px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-900"
              >
                Add your first item
              </button>
            )}
          </div>
        )}
      </section>

      {showForm && (
        <StorageForm
          editingItem={editingItem}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#171020]">{value}</p>
    </div>
  );
}

export default Storage;
