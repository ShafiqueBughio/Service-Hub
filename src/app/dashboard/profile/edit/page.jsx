"use client"
import React from 'react';
import PageHeader from '@/components/general/PageHeader';

const page = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <PageHeader title="Edit Profile" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Edit profile form coming soon.</p>
      </div>
    </div>
  );
};

export default page;
