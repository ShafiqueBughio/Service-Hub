import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      role: null, // "USER" | "CONTRACTOR"
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthStore;
