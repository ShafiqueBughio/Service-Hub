"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import VerificationForm from '@/components/auth/verification/VerificationForm';
import Title from '@/components/general/Title';
import useTokenStore from '@/lib/store/tokenStore';
import toast from 'react-hot-toast';
import { VerifyOTP, ResendOTP } from '@/lib/api/auth';

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('email');
  const {setAccessToken} = useTokenStore();

  const handleVerify = async (otp) => {
    try {
      const payload = {
        identifier: identifier,
        otp: otp,
        fcm_token: "optional_fcm_token"
      }
      const res = await VerifyOTP(payload);
      const accessToken = res?.data?.access_token;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      toast.success(res?.message || "OTP verified successfully!");
      router.push("/create-profile")
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
      console.log(errMsg)
    }
  };

  const handleResend = async() => {
    try {
      
      const payload = {
        identifier: identifier,
      }
      const res = await ResendOTP(payload);
      toast.success(res?.message || "OTP resent successfully!");
      console.log('OTP resent:', res?.otp);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
      console.log(errMsg);
    }
  };

  const content = (
    <>
      <VerificationForm onSubmit={handleVerify} onResend={handleResend} />
    </>
  );

  return (
    <>
      {/* ── MOBILE ── */}
      <MobileAuthLayout>
        <div className='flex-1 flex flex-col gap-8 min-h-0'>
                <div className='flex flex-col gap-2'>
        <h1 className='font-bold uppercase'>Verification Code</h1>
        <p className='text-gray-500 text-sm leading-6'>
          We&apos;ve sent you an email containing a 6-digit verification
          code. Please enter the code below to verify your identity.
        </p>
      </div>
          {content}
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full h-full flex-col px-12 py-10 overflow-y-auto'>

        {/* back + title row */}
        <div className='flex flex-col  gap-4 '>
          <Title title={"VERIFICATION CODE"}/>
           <p className='text-gray-500 text-sm leading-6'>
          We&apos;ve sent you an email containing a 6-digit verification
          code. Please enter the code below to verify your identity.
        </p>
        </div>

        <div className='my-auto w-full flex flex-col items-center  gap-8 '>
          {content}
        </div>
      </div>
    </>
  );
};

export default page;
