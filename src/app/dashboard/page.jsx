"use client"
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import useProfileStore from '@/lib/store/profileStore';


const stats = [
  { title: 'Total Projects', value: '197', change: '+15.50%' },
  { title: 'Reports Due', value: '201', change: '+15.50%' },
  { title: 'Reports Not Started', value: '201', change: '+15.50%' },
  { title: 'Reports Completed', value: '201', change: '+15.50%' },
];

const page = () => {
  const profile = useProfileStore((state) => state.profile);
  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'there';

  return (
    <>
      {/* welcome */}
      <div className='mb-6'>
        <p className='text-sm text-gray-500'>Welcome back, {displayName}!</p>
        <h1 className='font-bold text-gray-900'>Dashboard</h1>
      </div>

      {/* stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* placeholder for charts / calendar */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-64 flex items-center justify-center'>
          <p className='text-gray-400 text-sm'>Projects By Status — Chart coming soon</p>
        </div>
        <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-64 flex items-center justify-center'>
          <p className='text-gray-400 text-sm'>Calendar coming soon</p>
        </div>
      </div>
    </>
  );
};

export default page;
