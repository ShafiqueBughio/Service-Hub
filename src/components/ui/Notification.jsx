"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MdNotifications, MdDoneAll } from 'react-icons/md';
import { MdHistory } from 'react-icons/md';
import { getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from '@/lib/api/auth';
import useAuthStore from '@/lib/store/store';
import toast from 'react-hot-toast';

// ─── Time ago helper ──────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days  < 7)  return `${days}d`;
  return `${weeks}w`;
};

// ─── Single notification row ──────────────────────────────────────────────────
const NotifRow = ({ notif, onRead }) => (
  <button
    onClick={() => !notif.is_read && onRead(notif.id)}
    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left
      ${notif.is_read ? '' : 'bg-primary/5'}`}
  >
    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
      <MdNotifications size={18} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      {notif.title && (
        <p className={`text-xs font-semibold mb-0.5 ${notif.is_read ? 'text-gray-400' : 'text-primary'}`}>
          {notif.title}
        </p>
      )}
      <p className={`text-sm leading-5 ${notif.is_read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
        {notif.message}
      </p>
      <p className={`text-xs mt-1 ${notif.is_read ? 'text-gray-400' : 'text-primary'}`}>
        {timeAgo(notif.created_at)}
      </p>
    </div>
    {!notif.is_read && (
      <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-2" />
    )}
  </button>
);

// ─── Main Panel ───────────────────────────────────────────────────────────────
const Notification = ({ onClose }) => {
  const {
    notifications,
    setNotifications,
    notifPagination,
    setNotifPagination,
    setUnreadCount,
  } = useAuthStore();

  const [tab, setTab]           = useState('all');
  const [loading, setLoading]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [days, setDays]         = useState(12);  // current active range
  const panelRef                = useRef(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async ({ daysRange, page, append = false }) => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await getNotifications({ days: daysRange, page, limit: 20 });
      if (res?.status?.success) {
        const newItems  = Array.isArray(res.data?.data) ? res.data.data : [];
        const pagination = res.data?.pagination ?? {};

        setNotifications(append ? (prev) => {
          const existing = Array.isArray(prev) ? prev : [];
          // Deduplicate by id
          const ids  = new Set(existing.map((n) => n.id));
          const fresh = newItems.filter((n) => !ids.has(n.id));
          return [...existing, ...fresh];
        } : newItems);

        setNotifPagination(pagination);
      }
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [setNotifications, setNotifPagination]);

  // Initial fetch — 12 days page 1
  useEffect(() => {
    fetchNotifications({ daysRange: 12, page: 1 });
  }, []);

  // ── Outside click closes panel ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        (Array.isArray(prev) ? prev : []).map((n) => n.id === id ? { ...n, is_read: true } : n)
      );
      // Decrement global unread badge
      setUnreadCount((c) => Math.max(0, (c ?? 1) - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    const list     = Array.isArray(notifications) ? notifications : [];
    const hasUnread = list.some((n) => !n.is_read);
    if (!hasUnread) {
      toast('All notifications are already up to date.', { icon: '✓' });
      return;
    }
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => (Array.isArray(prev) ? prev : []).map((n) => ({ ...n, is_read: true })));
      // Refresh global unread count
      const res = await getUnreadCount();
      if (res?.status?.success) setUnreadCount(res.data?.unread_count ?? 0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  // Switch to 60-day range — resets to page 1
  const handleSeePrevious = () => {
    setDays(60);
    setNotifications([]);
    setNotifPagination({ total: 0, page: 1, limit: 20, totalPages: 1, hasNextPage: false, days: 60 });
    fetchNotifications({ daysRange: 60, page: 1 });
  };

  // Load more — append next page
  const handleLoadMore = () => {
    const nextPage = (notifPagination?.page ?? 1) + 1;
    fetchNotifications({ daysRange: days, page: nextPage, append: true });
  };

  // ── Derived display list ──────────────────────────────────────────────────
  const list     = Array.isArray(notifications) ? notifications : [];
  const displayed = tab === 'unread' ? list.filter((n) => !n.is_read) : list;
  const unread   = list.filter((n) => !n.is_read).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-4 top-[68px] z-50 w-[380px] max-h-[80dvh] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">Notifications</h2>
          {days === 60 && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              60 days
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          title="Mark all as read"
        >
          <MdDoneAll size={15} />
          Mark all read
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 px-4 pb-2 shrink-0">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${tab === 'all' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          All
        </button>
        <button
          onClick={() => setTab('unread')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${tab === 'unread' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Unread {unread > 0 && `(${unread})`}
        </button>
      </div>

      <div className="w-full h-px bg-gray-100 shrink-0" />

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdNotifications size={36} className="text-gray-300" />
            <p className="text-sm text-gray-400">
              {tab === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">
              {days === 12 ? 'Last 12 days' : 'Last 60 days'}
            </p>
            {displayed.map((notif) => (
              <NotifRow key={notif.id} notif={notif} onRead={handleMarkRead} />
            ))}
          </>
        )}

        {/* ── Load More ── */}
        {!loading && notifPagination?.hasNextPage && (
          <div className="px-4 py-3">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* ── See Previous Notifications (12→60 days) ── */}
      {!loading && days === 12 && (
        <div className="shrink-0 px-4 py-3 border-t border-gray-100">
          <button
            onClick={handleSeePrevious}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <MdHistory size={17} />
            See Previous Notifications
          </button>
        </div>
      )}

      {/* When on 60-day view, show a reset back to 12-day option */}
      {!loading && days === 60 && (
        <div className="shrink-0 px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => {
              setDays(12);
              setNotifications([]);
              fetchNotifications({ daysRange: 12, page: 1 });
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Back to recent (12 days)
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
