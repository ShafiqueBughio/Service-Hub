"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '@/lib/validation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import { useRouter } from 'next/navigation';
import { ResetPassword } from '@/lib/api/auth';
import toast from 'react-hot-toast';

const page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const getErrorMessage = (error) => {
    const msg = error?.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
  };

  const onSubmit = async (data) => {
    try {
      const payload = { password: data?.password };
      const res = await ResetPassword(payload);
      if(res?.status?.success){
        toast.success(res?.message || 'Password reset successfully');
        router.push('/login');
      }else{
        toast.error(res?.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const formProps = { register, errors, handleSubmit, onSubmit, isSubmitting };

  const content = (
    <>
      <div className='flex flex-col gap-1'>
        <h1 className='font-bold uppercase'>Update Your Password</h1>
        <p className='text-gray-700'>
          Choose a strong password you&apos;ll remember.
        </p>
      </div>
      <ResetPasswordForm {...formProps} />
    </>
  );

  if (isMobile) {
    return (
      <MobileAuthLayout>
        <div className='h-full flex flex-col gap-5'>
          {content}
        </div>
      </MobileAuthLayout>
    );
  }

  return (
    <div className='w-full px-12 flex flex-col gap-6 py-10'>
      {content}
    </div>
  );
};

export default page;
