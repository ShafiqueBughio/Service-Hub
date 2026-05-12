"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className='flex h-[100dvh] w-[100vw] overflow-hidden bg-gray-50'>

      {/* ── MOBILE sidebar — fixed overlay, does not push content ── */}
      {isMobile && (
        <>
          <div
            className='fixed top-0 left-0 h-full z-40 transition-all duration-300'
            style={{ width: isCollapsed ? '64px' : '224px' }}
          >
            <Sidebar isCollapsed={isCollapsed} onLogoClick={toggleCollapse} onNavClick={() => setIsCollapsed(true)} />
          </div>

          {/* backdrop — click to close when open */}
          {!isCollapsed && (
            <div
              className='fixed inset-0 z-30 bg-black/30'
              onClick={toggleCollapse}
            />
          )}

          {/* spacer so content doesn't go under collapsed sidebar */}
          <div className='shrink-0 w-16' />
        </>
      )}

      {/* ── DESKTOP sidebar — normal flow, pushes content ── */}
      {!isMobile && (
        <div
          className='shrink-0 h-full transition-all duration-300'
          style={{ width: isCollapsed ? '64px' : '224px' }}
        >
          <Sidebar isCollapsed={isCollapsed} onLogoClick={toggleCollapse} />
        </div>
      )}

      {/* main area */}
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
