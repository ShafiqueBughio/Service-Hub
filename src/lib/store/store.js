import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // ── Role ──────────────────────────────────────────────────────────────
      role: null, // "USER" | "CONTRACTOR"
      setRole:   (role) => set({ role }),
      clearRole: () => set({ role: null }),

      // ── Notifications list (current page/range) ───────────────────────────
      notifications: [],
      setNotifications: (notifications) =>
        set((state) => ({
          notifications:
            typeof notifications === 'function'
              ? notifications(state.notifications)
              : notifications,
        })),
      clearNotifications: () => set({ notifications: [] }),

      // ── Pagination metadata ───────────────────────────────────────────────
      notifPagination: { total: 0, page: 1, limit: 20, totalPages: 1, hasNextPage: false, days: 12 },
      setNotifPagination: (pagination) => set({ notifPagination: pagination }),

      // ── Global unread count — independent of date range ───────────────────
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: 'auth-store',
      // Only persist role — notifications are always re-fetched on open
      partialize: (state) => ({ role: state.role }),
    }
  )
);

export default useAuthStore;
