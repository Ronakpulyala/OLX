import { create } from 'zustand';
import { MOCK_LISTINGS } from '../lib/constants';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  createdAt: string;
  isFavorite: boolean;
  categoryId: string;
  condition: string;
  description: string;
  isAIVerified?: boolean;
  aiConfidence?: number;
  verificationAuditId?: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
  };
}

interface ListingsState {
  listings: Listing[];
  favorites: Listing[];
  searchQuery: string;
  verifiedOnly: boolean;
  setSearchQuery: (query: string) => void;
  setVerifiedOnly: (enabled: boolean) => void;
  toggleFavorite: (id: string) => void;
  addListing: (listing: Listing) => void;
}

export const useListingsStore = create<ListingsState>((set) => ({
  listings: MOCK_LISTINGS,
  favorites: MOCK_LISTINGS.filter(l => l.isFavorite),
  searchQuery: '',
  verifiedOnly: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setVerifiedOnly: (enabled) => set({ verifiedOnly: enabled }),
  addListing: (newListing) => set((state) => ({
    listings: [newListing, ...state.listings]
  })),
  toggleFavorite: (id) => set((state) => {
    const updatedListings = state.listings.map((l) =>
      l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
    );
    return {
      listings: updatedListings,
      favorites: updatedListings.filter(l => l.isFavorite),
    };
  }),
}));
