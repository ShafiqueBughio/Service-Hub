"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/lib/validation';
import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import { useRouter } from 'next/navigation';

const page = () => {
  const [agreed, setAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const { register, handleSubmit, formState: { errors, submitCount,isSubmitting } } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const router = useRouter();

  const onSubmit = async(data) => {
    if (!agreed) {
      setShowTermsError(true);
      return;
    }
    try {
     await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowTermsError(false);
    console.log({ ...data, agreeToTerms: true });
    router.push("/verification")
    } catch (error) {
      console.log(error);
    }
    // handle sign up API call here
  };

  const content = (
    <>
      <div className='flex flex-col gap-1'>
        <h1 className='font-bold'>SIGN UP</h1>
        <p className='text-gray-700'>Let&apos;s get you set up in just a few steps.</p>
      </div>

      <SignUpForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitCount={submitCount}
        agreed={agreed}
        setAgreed={setAgreed}
        showTermsError={showTermsError}
        isSubmitting = {isSubmitting}
        
      />
    </>
  );

  return (
    <>
      {/* ── MOBILE LAYOUT ── */}
      <MobileAuthLayout>
        <div className='h-full flex flex-col gap-5'>
          {content}
          <p className='text-center text-sm text-gray-500 mt-auto pt-4'>
            Already have an account?{' '}
            <Link href='/login' className='text-primary font-semibold underline'>
              Login
            </Link>
          </p>
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP LAYOUT ── */}
      <div className='hidden md:flex w-full px-12 flex-col gap-6 py-10'>
        {content}
        <p className='text-center text-sm text-gray-500 mt-auto pb-2'>
          Already have an account?{' '}
          <Link href='/login' className='text-primary font-semibold underline'>
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default page;
