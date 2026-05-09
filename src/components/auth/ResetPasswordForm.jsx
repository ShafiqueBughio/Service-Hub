import React from 'react';
import InputPassword from '@/components/ui/InputPassword';
import Button from '@/components/ui/Button';

const ResetPasswordForm = ({ register, errors, handleSubmit, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
      <InputPassword
        label='New Password'
        name='password'
        placeholder='Enter Password'
        register={register}
        errors={errors}
      />

      <InputPassword
        label='Confirm New Password'
        name='confirmPassword'
        placeholder='Enter Password'
        register={register}
        errors={errors}
      />

      <Button
        text={isSubmitting ? 'Updating...' : 'Update Password'}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default ResetPasswordForm;
