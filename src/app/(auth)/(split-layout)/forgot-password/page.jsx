"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/lib/validation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ForgotPassword } from '@/lib/api/auth';
import toast from 'react-hot-toast';

const page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const getErrorMessage = (error) => {
  const msg = error?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
};

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    const payload = { identifier: data?.email };
    try {
      const res = await ForgotPassword(payload);
      if(res?.status?.success){
        toast.success(res?.message || 'Password reset otp sent to your email');
        router.push(`/verification?purpose=FORGOT_PASSWORD&email=${data?.email}`);
      }else{
        toast.error(res?.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
     toast.error(getErrorMessage(error));
    }
  };

  const formProps = { register, errors, handleSubmit, onSubmit, isSubmitting };

  const content = (
    <>
      <div className='flex flex-col gap-1'>
        <h1 className='font-bold uppercase'>Forgot Password</h1>
        <p className='text-gray-700'>
          Enter your registered email to reset your password.
        </p>
      </div>
      <ForgotPasswordForm {...formProps} />
    </>
  );

  const bottomLink = (
    <p className='text-center text-sm text-gray-500 mt-auto pt-4'>
      Remember your password?{' '}
      <Link href='/login' className='text-primary font-semibold underline'>
        Login
      </Link>
    </p>
  );

  if (isMobile) {
    return (
      <MobileAuthLayout>
        <div className='h-full flex flex-col gap-5'>
          {content}
          {bottomLink}
        </div>
      </MobileAuthLayout>
    );
  }

  return (
    <div className='w-full px-12 flex flex-col gap-6 py-10'>
      {content}
      {bottomLink}
    </div>
  );
};

export default page;
