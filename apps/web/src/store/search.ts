import { create } from 'zustand';

interface SearchState {
  query: string;
  category: string;
  location: string;
  setQuery: (q: string) => void;
  setCategory: (c: string) => void;
  setLocation: (l: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  category: '',
  location: '',
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setLocation: (location) => set({ location }),
}));
