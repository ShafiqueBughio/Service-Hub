"use client"
import LoginPage from '@/components/auth/LoginPage';
import React, { useState, useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
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

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      reset();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LoginPage
      register={register}
      errors={errors}
      handleSubmit={handleSubmit}
      handleLogin={handleLogin}
      isSubmitting={isSubmitting}
      isMobile={isMobile}
    />
  );
};

export default page;
