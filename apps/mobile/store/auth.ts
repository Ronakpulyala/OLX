import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (phone: string, otp: string) => {
    // Mock login
    setTimeout(() => {
      set({
        user: {
          id: 'u1',
          name: 'Ronak Reddy',
          avatar: 'https://i.pravatar.cc/150?u=u1',
          phone,
          rating: 4.9,
        },
        isAuthenticated: true,
      });
    }, 1000);
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
