"use client"
import LoginPage from '@/components/auth/LoginPage';
import React, { useState, useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Login } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import useTokenStore from '@/lib/store/tokenStore';
import useAuthStore from '@/lib/store/store';

const page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { setAccessToken } = useTokenStore();
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const getErrorMessage = (error) => {
    const msg = error?.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
  };

  const handleLogin = async (data) => {
    try {
      if (!role) {
        toast.error('Please go back and select your account type first.');
        router.push('/');
        return;
      }

      const payload = {
        identifier: data?.email,
        password: data?.password,
        user_type: role,
        fcm_token: "optional_fcm_token",
      };

      const res = await Login(payload);
      if (res?.status?.success) {
        setAccessToken(res?.data?.access_token);
        router.push("/dashboard");
      } else {
        toast.error(res?.message || 'Failed to login');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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
