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
import { VerifyOTP, ResendOTP , VerifyForgotPasswordOTP,ResendOTPForForgetPassword} from '@/lib/api/auth';

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('email');
  const purpose = searchParams.get('purpose');
  const {setAccessToken} = useTokenStore();

  const getErrorMessage = (error) => {
    const msg = error?.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
  };

  const handleVerify = async (otp) => {
    try {
      const payload = {
        identifier,
        otp,
      };
  
      let res;
  
      if (purpose === "REGISTER") {
        // Registration flow: verify OTP → get access_token + refresh_token → login session
        const registerPayload = { ...payload, fcm_token: "optional_fcm_token" };
        res = await VerifyOTP(registerPayload);

        const accessToken = res?.data?.access_token;
        if (accessToken) {
          setAccessToken(accessToken);
        }

        toast.success(res?.message || "OTP verified successfully!");
         localStorage.removeItem('otp_timer_end');
        router.push("/create-profile");

      } else {
        // Forgot password flow: verify OTP → get reset_token (NOT a login session)
        res = await VerifyForgotPasswordOTP(payload);

        const resetToken = res?.data?.reset_token;
        if (resetToken) {
          // Store reset_token temporarily — used only for the reset_password request
          sessionStorage.setItem("reset_token", resetToken);
        }

        toast.success(res?.message || "OTP verified successfully!");
        localStorage.removeItem('otp_timer_end');
        router.push("/reset-password");
      }
  
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async() => {
    try {
      
      const payload = {
        identifier: identifier,
      }

      let res;

      if(purpose === "REGISTER"){
        res = await ResendOTP(payload);
      }else{
        res = await ResendOTPForForgetPassword(payload);
      }

      if(res?.status?.success){
        toast.success(res?.message || "OTP resent successfully!");
      }else{
        toast.error(res?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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
