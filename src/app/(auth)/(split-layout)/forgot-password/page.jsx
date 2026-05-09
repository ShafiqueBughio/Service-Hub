"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/lib/validation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Title from '@/components/general/Title';

const page = () => {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Forgot password email:', data.email);
      router.push('/verification');
    } catch (error) {
      console.log(error);
    }
  };

  const content = (
    <>
      <ForgotPasswordForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );

  return (
    <>
      {/* ── MOBILE ── */}
      <MobileAuthLayout>
        <div className='h-full flex flex-col gap-5'>
             <div className='flex flex-col gap-1'>
        <h1 className='font-bold uppercase'>Forgot Password</h1>
        <p className='text-gray-700'>
          Enter your registered email to reset your password.
        </p>
      </div>
          {content}
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full px-12 flex-col gap-6 py-10'>
        <div className='w-full h-full flex flex-col gap-5'>
            <Title title={"Forgot Password"}/>
        <p className='text-gray-700'>
          Enter your registered email to reset your password.
        </p>
        </div>
        {content}
      </div>
    </>
  );
};

export default page;
