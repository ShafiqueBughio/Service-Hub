"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '@/lib/validation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import { useRouter } from 'next/navigation';
import Title from '@/components/general/Title';

const page = () => {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
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

  const content = (
    <>
      <ResetPasswordForm
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
       <Title title={"Update Your Password"} isBack={false}/>
        <p className='text-gray-700'>
          Choose a strong password you&apos;ll remember.
        </p>
      </div>
          {content}
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full px-12 flex-col gap-6 py-10'>
        <div className='flex flex-col gap-1'>
       <Title title={"Update Your Password"}/>
        <p className='text-gray-700'>
          Choose a strong password you&apos;ll remember.
        </p>
      </div>
        {content}
      </div>
    </>
  );
};

export default page;
