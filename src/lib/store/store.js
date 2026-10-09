import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      role: null, // "USER" | "CONTRACTOR"
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),

       // Notifications
      notifications: [],
     setNotifications: (notifications) =>
        set((state) => ({
          notifications:
            typeof notifications === 'function'
              ? notifications(state.notifications)
              : notifications,
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthStore;
