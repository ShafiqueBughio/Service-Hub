"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import VerificationForm from '@/components/auth/verification/VerificationForm';
import Title from '@/components/general/Title';

const page = () => {
  const router = useRouter();

  const handleVerify = (otp) => {
    console.log('OTP submitted:', otp);
    // handle verification API call here
  };

  const handleResend = () => {
    console.log('Resend OTP');
    // handle resend API call here
  };

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <h1 className='font-bold uppercase'>Verification Code</h1>
        <p className='text-gray-500 text-sm leading-6'>
          We&apos;ve sent you an email containing a 6-digit verification
          code. Please enter the code below to verify your identity.
        </p>
      </div>

      <VerificationForm onSubmit={handleVerify} onResend={handleResend} />
    </>
  );

  return (
    <>
      {/* ── MOBILE ── */}
      <MobileAuthLayout>
        <div className='flex-1 flex flex-col gap-8 min-h-0'>
          {content}
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full h-full flex-col px-12 py-10 overflow-y-auto'>

        {/* back + title row */}
        <div className='flex items-center gap-3 shrink-0'>
          <Title />
        </div>

        <div className='my-auto w-full flex flex-col items-center  gap-8 '>
          {content}
        </div>
      </div>
    </>
  );
};

export default page;
