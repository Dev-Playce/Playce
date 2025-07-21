import { create } from "zustand";
import type { RestaurantDetail } from "../types/restaurant.types";

interface BookmarkState {
  bookmarks: RestaurantDetail[];
  addBookmark: (store: RestaurantDetail) => void;
  removeBookmark: (id: number) => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  addBookmark: (store) => {
    const exists = get().bookmarks.some((b) => b.id === store.id);
    if (!exists) set((state) => ({ bookmarks: [...state.bookmarks, store] }));
  },
  removeBookmark: (id) => {
    set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== id) }));
  },
}));
