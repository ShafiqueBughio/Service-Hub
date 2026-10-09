"use client"
import React, { useEffect, useState, useRef } from 'react';
import { MdNotifications, MdDoneAll } from 'react-icons/md';
import { markAllNotificationsRead, markNotificationRead } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/store';
import { IoMdAlert } from "react-icons/io";
import { showAlreadyReadToast } from '../general/toast';

// ─── Time ago helper ──────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7)   return `${days}d`;
  return `${weeks}w`;
};

// ─── Single notification row ──────────────────────────────────────────────────
const NotifRow = ({ notif, onRead }) => (
  <button
    onClick={() => !notif.is_read && onRead(notif.id)}
    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left
      ${notif.is_read ? '' : 'bg-primary/5'}`}
  >
    {/* icon circle */}
    <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
      <MdNotifications size={20} className="text-primary" />
    </div>

    {/* text */}
    <div className="flex-1 min-w-0">
      <p className={`text-sm leading-5 ${notif.is_read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
        {notif.message}
      </p>
      <p className={`text-xs mt-1 ${notif.is_read ? 'text-gray-400' : 'text-primary'}`}>
        {timeAgo(notif.created_at)}
      </p>
    </div>

    {/* unread dot */}
    {!notif.is_read && (
      <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-2" />
    )}
  </button>
);

// ─── Main Panel ───────────────────────────────────────────────────────────────
const Notification = ({ onClose }) => {

  const {notifications,setNotifications,clearNotifications} = useAuthStore();
  const [tab, setTab]               = useState('all');       // 'all' | 'unread'
  const panelRef                    = useRef(null);


  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleMarkRead = async (id) => {
  try {
    await markNotificationRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  } catch {
    toast.error('Failed to mark as read');
  }
};

  // const handleMarkAllRead = async () => {
  //   try {
  //     await markAllNotificationsRead();
  //     setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  //     toast.success('All notifications marked as read');
  //   } catch {
  //     toast.error('Failed to mark all as read');
  //   }
  // };

  
const handleMarkAllRead = async () => {
  const notificationList = Array.isArray(notifications)
    ? notifications
    : [];

  // Check if all notifications are already read
  const hasUnread = notificationList.some(
    (n) => !n.is_read
  );

  if (!hasUnread) {
    showAlreadyReadToast('All notifications are already up to date.');
    return;
  }

  try {
    await markAllNotificationsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    toast.success('All notifications marked as read');
  } catch {
    toast.error('Failed to mark all as read');
  }
};

  const displayed = tab === 'unread'
  ? (Array.isArray(notifications)
      ? notifications.filter((n) => !n.is_read)
      : [])
  : (Array.isArray(notifications) ? notifications : []);

const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => !n.is_read).length
  : 0;

  return (
    <div
      ref={panelRef}
      className="absolute right-4 top-[68px] z-50 w-[380px] max-h-[80dvh] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          title="Mark all as read"
        >
          <MdDoneAll size={16} />
          Mark all read
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 px-4 pb-2">
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
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="w-full h-px bg-gray-100" />

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        { displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdNotifications size={36} className="text-gray-300" />
            <p className="text-sm text-gray-400">No notifications</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">
              Earlier
            </p>
            {displayed.map((notif) => (
              <NotifRow key={notif.id} notif={notif} onRead={handleMarkRead} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;
