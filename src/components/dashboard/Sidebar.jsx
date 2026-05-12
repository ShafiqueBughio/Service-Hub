"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ServiceHub_Logo, Service_Hub_sm_Logo } from '@/assets/images';
import { TbGavel } from "react-icons/tb";
import {
  MdDashboard, MdWork, MdBarChart,
  MdHelpOutline, MdSettings, MdLogout
} from 'react-icons/md';
import { Star, History, Wallet } from 'lucide-react';
import useAuthStore from '@/lib/store/store';

const navItemsContractor = [
  { label: 'Home', icon: MdDashboard, href: '/dashboard' },
  { label: 'My Bids', icon: TbGavel, href: '/dashboard/bids' },
  { label: 'Rating & Reviews', icon: Star, href: '/dashboard/ratings' },
  { label: 'Credit Wallet', icon: Wallet, href: '/dashboard/wallet' },
  { label: 'Analytics', icon: MdBarChart, href: '/dashboard/analytics' },
  { label: 'Settings', icon: MdSettings, href: '/dashboard/settings' },
];

const navItemsUser = [
  { label: 'Home', icon: MdDashboard, href: '/dashboard' },
  { label: 'Projects', icon: MdWork, href: '/dashboard/projects' },
  { label: 'Rating & Reviews', icon: Star, href: '/dashboard/ratings' },
  { label: 'Job History', icon: History, href: '/dashboard/job-history' },
  { label: 'Settings', icon: MdSettings, href: '/dashboard/settings' },
];

const Sidebar = ({ isCollapsed, onLogoClick, onNavClick }) => {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.role);  // ← hook inside component
  const showLabel = !isCollapsed;

  const navItems = role === 'contractor' ? navItemsContractor : navItemsUser;

  return (
    <aside
      className='h-full w-full flex flex-col bg-cover bg-center relative overflow-hidden'
      style={{ backgroundImage: "url('/background_img.png')" }}
    >
      {/* overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* content */}
      <div className='relative z-10 flex flex-col gap-4 h-full'>

        {/* logo — click to toggle on desktop */}

        {
          isCollapsed ? (
            <button  onClick={onLogoClick}
          className='p-4 flex items-center justify-center gap-2 w-full text-left focus:outline-none cursor-pointer '
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <div className=' p-1.5 shrink-0'>
            <Image
              src={Service_Hub_sm_Logo}
              alt='ServiceHub'
              width={48}
              height={48}
              className='object-contain rounded-lg '
            />
          </div>
            </button>
          ):(
        <button
          onClick={onLogoClick}
          className='relative p-12 flex items-center gap-2 w-full text-left focus:outline-none cursor-pointer'
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Image
            src={ServiceHub_Logo}
            alt='ServiceHub'
            fill
            className='object-cover'
          />
        </button>
            
          )
        }

        {/* nav items */}
        <nav className='flex-1 flex flex-col gap-1 px-2 mt-2'>
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon size={20} className='shrink-0' />
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                    ${showLabel ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* logout */}
        <div className='px-2 pb-6'>
          <button className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all'>
            <MdLogout size={20} className='shrink-0' />
            <span
              className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                ${showLabel ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
