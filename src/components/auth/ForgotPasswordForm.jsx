import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MdOutlineEmail } from 'react-icons/md';

const ForgotPasswordForm = ({ register, errors, handleSubmit, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
      <Input
        label='Email Address'
        name='email'
        type='email'
        placeholder='Enter Email Address'
        register={register}
        errors={errors}
        icon={<MdOutlineEmail size={20} />}
      />

      <Button
        text={isSubmitting ? 'Continuing...' : 'Continue'}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default ForgotPasswordForm;
