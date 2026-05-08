"use client"
import React, { useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import InputPassword from '@/components/ui/InputPassword';
import Button from '@/components/ui/Button';
import { MdOutlineEmail } from 'react-icons/md';
import Link from 'next/link';

const SignUpForm = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  submitCount,
  agreed,
  setAgreed,
  showTermsError,
  isSubmitting
}) => {
  const termsRef = useRef(null);

  // shake when terms error shows
  useEffect(() => {
    if (showTermsError && termsRef.current) {
      const el = termsRef.current;
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
  }, [showTermsError, submitCount]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full flex flex-col gap-5'
    >
      {/* Email */}
      <Input
        label='Email Address'
        name='email'
        type='email'
        placeholder='Enter Email Address'
        register={register}
        errors={errors}
        icon={<MdOutlineEmail size={20} />}
      />

      {/* Create Password */}
      <InputPassword
        label='Create Password'
        name='password'
        placeholder='Enter Password'
        register={register}
        errors={errors}
      />

      {/* Confirm Password */}
      <InputPassword
        label='Confirm Password'
        name='confirmPassword'
        placeholder='Enter Password'
        register={register}
        errors={errors}
      />

      {/* Agree to Terms — completely outside RHF/Yup */}
      <div className='flex items-start gap-2'>
        <input
          id='agreeToTerms'
          type='checkbox'
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className='mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 cursor-pointer accent-primary'
        />
        <label
          htmlFor='agreeToTerms'
          className='text-sm text-gray-700 leading-5 cursor-pointer select-none'
        >
          I agree with the{' '}
          <span ref={termsRef} className='inline-block'>
            <Link
              href='/agreements?active=terms'
              onClick={(e) => e.stopPropagation()}
              className='text-primary underline font-medium'
            >
              Terms &amp; Conditions
            </Link>
            {' | '}
            <Link
              href='/agreements?active=privacy'
              onClick={(e) => e.stopPropagation()}
              className='text-primary underline font-medium'
            >
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {/* Submit */}
      <Button text={isSubmitting?"Signing Up":"Sign Up"} isSubmitting={isSubmitting} />
    </form>
  );
};

export default SignUpForm;
