import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProgressEntry = {
  position: number;
  duration: number;
  episodeId?: string;
  updatedAt: number;
};

type LibraryState = {
  myList: string[];
  progress: Record<string, ProgressEntry>;
  toggleList: (id: string) => void;
  inList: (id: string) => boolean;
  setProgress: (id: string, entry: ProgressEntry) => void;
  clearProgress: (id: string) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      myList: [],
      progress: {},
      toggleList: (id) =>
        set((s) => ({
          myList: s.myList.includes(id)
            ? s.myList.filter((x) => x !== id)
            : [id, ...s.myList],
        })),
      inList: (id) => get().myList.includes(id),
      setProgress: (id, entry) =>
        set((s) => ({ progress: { ...s.progress, [id]: entry } })),
      clearProgress: (id) =>
        set((s) => {
          const next = { ...s.progress };
          delete next[id];
          return { progress: next };
        }),
    }),
    { name: "velora-library" },
  ),
);

export const ADMIN_TOKEN_KEY = "velora-admin-token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
