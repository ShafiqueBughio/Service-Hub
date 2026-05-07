"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import { MdOutlineEmail } from "react-icons/md";
import InputPassword from '../ui/InputPassword';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import Divider from '../ui/Divider';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Link from 'next/link';
import MobileAuthLayout from './MobileAuthLayout';

const LoginPage = ({ register, errors, handleSubmit, handleLogin }) => {
  const router = useRouter();

  const SignOptions = [
    { id: 1, title: "Sign in Apple", icon: <FaApple size={20} /> },
    { id: 2, title: "Sign in Google", icon: <FcGoogle size={20} /> }
  ];

  const formContent = (
    <>
      {/* heading */}
      <div className='flex flex-col gap-1'>
        <h1 className='font-bold'>LOGIN</h1>
        <p className='text-gray-700'>Please enter your email and password.</p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-4'>
        <Input
          label="Email"
          name="email"
          placeholder="Enter Email Address"
          register={register}
          errors={errors}
          type="email"
          icon={<MdOutlineEmail size={20} />}
        />

        <InputPassword
          name="password"
          register={register}
          errors={errors}
          placeholder="Enter Password"
          label="Password"
        />

        <div className='flex justify-between items-center'>
          <Checkbox
            label="Remember me"
            name="remember"
            errors={errors}
            register={register}
          />
          <button type='button' className='text-sm text-primary hover:underline'>
            Forgot password?
          </button>
        </div>

        <Button text="Login" />
      </form>

      <Divider />

      {/* social buttons */}
      <div className='w-full flex gap-4 justify-center items-center'>
        {SignOptions.map((opt) => (
          <div
            key={opt.id}
            className='w-40 p-2 flex gap-2 items-center justify-center cursor-pointer border border-gray-400 rounded-full'
          >
            {opt.icon}
            <p>{opt.title}</p>
          </div>
        ))}
      </div>

      <Link
        href="/sign-up"
        className='text-gray-800 text-center font-semibold hover:underline'
      >
        Sign Up Now
      </Link>
    </>
  );

  return (
    <>
      {/* ── MOBILE ── */}
      <MobileAuthLayout>
        <div className='h-full flex flex-col gap-5'>
          {formContent}

          {/* terms — bottom */}
          <div className='mt-auto pt-4 w-full flex flex-col justify-center items-center'>
            <p>By signing-in, you agree to our</p>
            <p>
              <span
                className='font-semibold cursor-pointer'
                onClick={() => router.push("/agreements?active=terms")}
              >
                Terms &amp; Conditions
              </span>
              {' | '}
              <span
                className='font-semibold cursor-pointer'
                onClick={() => router.push("/agreements?active=privacy")}
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full h-full px-12 flex-col gap-6 pt-4  mx-auto overflow-y-auto'>

        {/* center content */}
        <div className='my-auto flex flex-col gap-6'>
          {formContent}
        </div>

        {/* terms — pinned to bottom */}
        <div className='mt-auto pb-2 w-full flex flex-col justify-center items-center'>
          <p>By signing-in, you agree to our</p>
          <p>
            <span
              className='font-semibold cursor-pointer'
              onClick={() => router.push("/agreements?active=terms")}
            >
              Terms &amp; Conditions
            </span>
            {' | '}
            <span
              className='font-semibold cursor-pointer'
              onClick={() => router.push("/agreements?active=policy")}
            >
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
