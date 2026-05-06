"use client"
import LoginPage from '@/components/auth/LoginPage';
import React, { useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const page = () => {
  const [FormData,setFormData] = useState(null);

    const {register,handleSubmit,formState:{errors,isSubmitting},reset} = useForm({resolver:yupResolver(loginSchema)});

    const router = useRouter();
    
  const handleLogin = (data) => {
    try {
      setFormData(data);
    reset();
    router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return <LoginPage register={register} errors={errors} handleSubmit = {handleSubmit} handleLogin = {handleLogin} />;
};

export default page;
