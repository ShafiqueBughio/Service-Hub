import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

const StatCard = ({ title, value, change, changeLabel = 'increase from last' }) => {
  return (
    <div className='bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100'>
      <div className='flex items-start justify-between'>
        <p className='text-sm text-gray-500 font-medium'>{title}</p>
        <MdArrowOutward size={18} className='text-gray-400' />
      </div>
      <p className='text-3xl font-bold text-gray-900'>{value}</p>
      <div className='flex items-center gap-2'>
        <span className='text-xs font-semibold text-white bg-primary-gradient px-2 py-0.5 rounded-full'>
          {change}
        </span>
        <span className='text-xs text-gray-400'>{changeLabel}</span>
      </div>
    </div>
  );
};

export default StatCard;
