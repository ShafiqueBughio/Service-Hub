"use client"
import React from 'react';
import { GoLink } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";

const MobileAuthLayout = ({ children }) => {
  const router = useRouter();

  return (
    <div className='flex md:hidden flex-col w-full h-[100dvh]'>

      {/* top teal section with background image */}
      <div
        className='relative shrink-0 flex flex-col items-center justify-center gap-3 px-6 pt-12 pb-16 bg-cover bg-center'
        style={{ backgroundImage: "url('/background_img.png')" }}
      >
        {/* overlay */}
        <div className='absolute inset-0 bg-white/20' />

        {/* back button */}
        <button
          onClick={() => router.back()}
          className='absolute top-4 left-4 z-10 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow'
        >
          <span className='text-gray-700 text-lg font-bold'>
            <IoIosArrowBack size={18}/>
          </span>
        </button>

        {/* branding */}
        <div className='relative z-10 flex items-center gap-1'>
          <h1 className='text-primary tracking-widest uppercase'>Service</h1>
          <GoLink size={26} className='text-primary' />
          <h1 className='text-primary tracking-widest uppercase'>Hub</h1>
        </div>
      </div>

      {/* white card — takes remaining height and scrolls if needed */}
      <div className='relative -mt-6 flex-1 min-h-0 bg-white rounded-t-3xl px-6 pt-8 pb-6 flex flex-col shadow-lg overflow-y-auto'>
        {children}
      </div>

    </div>
  );
};

export default MobileAuthLayout;
