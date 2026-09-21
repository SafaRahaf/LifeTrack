export type StorageCategory =
  | "electronics"
  | "documents"
  | "clothing"
  | "accessories"
  | "household"
  | "other";

export interface StoredItem {
  id: string;
  name: string;
  category: StorageCategory;
  location: string;
  notes: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}
