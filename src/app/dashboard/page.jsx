"use client"
import React, { useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import useProfileStore from '@/lib/store/profileStore';
import { IoAddOutline } from "react-icons/io5";
import useAuthStore from '@/lib/store/store';
import CreateJobModal from '@/components/Job/CreateJobModal';


const stats = [
  { title: 'Total Projects', value: '197', change: '+15.50%' },
  { title: 'Reports Due', value: '201', change: '+15.50%' },
  { title: 'Reports Not Started', value: '201', change: '+15.50%' },
  { title: 'Reports Completed', value: '201', change: '+15.50%' },
];

const page = () => {
  const [openJobModal,setOpenJobModal] = useState(false);
  const profile = useProfileStore((state) => state.profile);

  const {role} = useAuthStore();

  const handleCloseJobModal = ()=>{
    setOpenJobModal(false);
  }

  console.log(profile, "Profile")
  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'there';

  return (
    <div>
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
      {/* Add Job Floating Button */}
      {
        role === "USER" && (
      <button
        type="button"
        onClick={()=>setOpenJobModal(true)}
        title='Add Job'
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-200 hover:bg-secondary hover:scale-105 cursor-pointer"
        aria-label="Add Job"
      >
        <IoAddOutline size={28} />
      </button>
        )
      }
      {
         openJobModal && (
          <CreateJobModal onClose={handleCloseJobModal}/>
        )
      }
    </div>
  );
};

export default page;
