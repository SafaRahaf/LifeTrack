import { Archive, Edit3, MapPin, Star, Trash2 } from "lucide-react";
import type { StoredItem } from "../../types/storage";

interface StorageCardProps {
  item: StoredItem;
  onEdit: (item: StoredItem) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<StoredItem["category"], string> = {
  electronics: "Electronics",
  documents: "Documents",
  clothing: "Clothing",
  accessories: "Accessories",
  household: "Household",
  other: "Other",
};

const categoryStyles: Record<StoredItem["category"], string> = {
  electronics: "bg-purple-100 text-purple-700",
  documents: "bg-amber-100 text-amber-700",
  clothing: "bg-pink-100 text-pink-700",
  accessories: "bg-violet-100 text-violet-700",
  household: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-700",
};

function StorageCard({ item, onEdit, onDelete }: StorageCardProps) {
  return (
    <article className="group rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-purple-700">
            <Archive size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-[#171020]">{item.name}</h3>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                categoryStyles[item.category]
              }`}
            >
              {categoryLabels[item.category]}
            </span>
          </div>
        </div>

        {item.isImportant && (
          <Star
            size={19}
            className="shrink-0 fill-amber-400 text-amber-400"
            aria-label="Important item"
          />
        )}
      </div>

      <div className="mt-4 rounded-xl bg-purple-50/70 p-3">
        <div className="flex items-start gap-2">
          <MapPin size={17} className="mt-0.5 shrink-0 text-pink-500" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-purple-500">
              Stored at
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-purple-950">
              {item.location}
            </p>
          </div>
        </div>
      </div>

      {item.notes && (
        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-gray-500 w-[calc(100%-1rem)] line-clamp-3">
          {item.notes}
        </p>
      )}

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => onEdit(item)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700"
        >
          <Edit3 size={15} />
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default StorageCard;
