"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { getUserProfile, getUnreadCount } from '@/lib/api/auth';
import useProfileStore from '@/lib/store/profileStore';
import Notification from '../ui/Notification';
import useAuthStore from '@/lib/store/store';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [toggle, setToggle]           = useState(false);

  const setProfile    = useProfileStore((state) => state.setProfile);
  const setUnreadCount = useAuthStore((state) => state.setUnreadCount);

  // Fetch user profile once on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res?.status?.success) setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch global unread count on mount — used by Navbar badge
  // Independent of any date range, reflects all unread notifications
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getUnreadCount();
        if (res?.status?.success) {
          setUnreadCount(res.data?.unread_count ?? 0);
        }
      } catch {
        // badge silently fails — not critical
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className='flex h-[100dvh] w-[100vw] overflow-hidden bg-gray-50'>

      {/* ── MOBILE sidebar ── */}
      {isMobile && (
        <>
          <div
            className='fixed top-0 left-0 h-full z-40 transition-all duration-300'
            style={{ width: isCollapsed ? '64px' : '224px' }}
          >
            <Sidebar isCollapsed={isCollapsed} onLogoClick={toggleCollapse} onNavClick={() => setIsCollapsed(true)} />
          </div>
          {!isCollapsed && (
            <div className='fixed inset-0 z-30 bg-black/30' onClick={toggleCollapse} />
          )}
          <div className='shrink-0 w-16' />
        </>
      )}

      {/* ── DESKTOP sidebar ── */}
      {!isMobile && (
        <div
          className='shrink-0 h-full transition-all duration-300'
          style={{ width: isCollapsed ? '64px' : '224px' }}
        >
          <Sidebar isCollapsed={isCollapsed} onLogoClick={toggleCollapse} />
        </div>
      )}

      {/* ── Main area ── */}
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden relative'>
        <Navbar toggle={toggle} setToggle={setToggle} />
        {toggle && <Notification onClose={() => setToggle(false)} />}
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
