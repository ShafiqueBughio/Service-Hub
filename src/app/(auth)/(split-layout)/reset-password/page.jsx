"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '@/lib/validation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import { useRouter } from 'next/navigation';

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

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Reset password:', data);
      router.push('/login');
    } catch (error) {
      console.log(error);
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
