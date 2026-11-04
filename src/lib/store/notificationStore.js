
import { create } from "zustand";

const initialPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNextPage: false,
  days: 12,
};

const useNotificationStore = create((set) => ({
  notifications: [],
  notificationIds: new Set(),

  notifPagination: initialPagination,
  unreadCount: 0,

  // Set notifications from API
  setNotifications: (value) =>
    set((state) => {
      const items =
        typeof value === "function"
          ? value(state.notifications)
          : value;

      const unique = [];
      const ids = new Set();

      (Array.isArray(items) ? items : []).forEach((item) => {
        const id = String(item.id);

        if (!ids.has(id)) {
          ids.add(id);
          unique.push(item);
        }
      });

      return {
        notifications: unique,
        notificationIds: ids,
      };
    }),

  // Add notification from Socket.IO or FCM
  addNotification: (notification) => {
    if (!notification?.id) return false;

    let added = false;

    set((state) => {
      const id = String(notification.id);

      if (state.notificationIds.has(id)) {
        return state;
      }

      added = true;

      const ids = new Set(state.notificationIds);
      ids.add(id);

      return {
        notifications: [notification, ...state.notifications],
        notificationIds: ids,

        notifPagination: {
          ...state.notifPagination,
          total: state.notifPagination.total + 1,
        },

        unreadCount: notification.is_read
          ? state.unreadCount
          : state.unreadCount + 1,
      };
    });

    return added;
  },

  setNotifPagination: (pagination) =>
    set({ notifPagination: pagination }),

  setUnreadCount: (value) =>
    set((state) => ({
      unreadCount:
        typeof value === "function"
          ? value(state.unreadCount)
          : value,
    })),

  // Mark one notification as read
  markNotificationRead: (id) =>
    set((state) => {
      const notification = state.notifications.find(
        (item) => String(item.id) === String(id)
      );

      if (!notification || notification.is_read) return state;

      return {
        notifications: state.notifications.map((item) =>
          String(item.id) === String(id)
            ? { ...item, is_read: true }
            : item
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),

  // Mark all currently loaded notifications as read
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        is_read: true,
      })),
      unreadCount: 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      notificationIds: new Set(),
      notifPagination: initialPagination,
    }),

  resetNotifications: () =>
    set({
      notifications: [],
      notificationIds: new Set(),
      notifPagination: initialPagination,
      unreadCount: 0,
    }),
}));

export default useNotificationStore;
