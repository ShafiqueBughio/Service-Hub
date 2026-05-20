"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/lib/validation';
import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SignUp } from '@/lib/api/auth';
import useAuthStore from '@/lib/store/store';

const page = () => {
  const role = useAuthStore((state) => state.role);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [apiResponse,setApiResponse] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { register, handleSubmit, formState: { errors, submitCount, isSubmitting } } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    if (!agreed) {
      setShowTermsError(true);
      return;
    }
    const payload = {
      identifier : data?.email,
      password : data?.password,
      user_type : role,
      fcm_token : "optional_fcm_token"
    }
    try {
      const res = await SignUp(payload);
      setApiResponse(res);
      toast.success(res?.message || "Signup Successfully!");
      router.push(`/verification?purpose=REGISTER&email=${data?.email}`);
      setShowTermsError(false);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
      console.log(errMsg)
    }
  };

  const formProps = {
    register, errors, handleSubmit, onSubmit,
    submitCount, agreed, setAgreed, showTermsError, isSubmitting,
  };

  const bottomLink = (
    <p className='text-center text-sm text-gray-500 mt-auto pt-4'>
      Already have an account?{' '}
      <Link href='/login' className='text-primary font-semibold underline'>
        Login
      </Link>
    </p>
  );

  const content = (
    <>
      <div className='flex flex-col gap-1'>
        <h1 className='font-bold'>SIGN UP</h1>
        <p className='text-gray-700'>Let&apos;s get you set up in just a few steps.</p>
      </div>
      <SignUpForm {...formProps} />
    </>
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
