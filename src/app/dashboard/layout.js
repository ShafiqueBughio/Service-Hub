"use client"
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useEffect } from 'react';
import { initializeMessaging } from '@/services/firebaseMessaging';

export default function Layout({ children }) {
  //initialize fcm for protected routes only.
   useEffect(() => {
    initializeMessaging();
  }, []);

  return <DashboardLayout>{children}</DashboardLayout>;
}
