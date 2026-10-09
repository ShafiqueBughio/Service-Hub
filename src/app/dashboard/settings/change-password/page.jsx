"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePasswordSchema, setePasswordSchema, setPasswordSchema } from '@/lib/validation';
import PageHeader from '@/components/general/PageHeader';
import InputPassword from '@/components/ui/InputPassword';
import { ChangePassword, SetPassword } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useProfileStore from '@/lib/store/profileStore';

const page = () => {
  const router = useRouter();

  const {profile} = useProfileStore();

  const hasPassword = profile?.has_password;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(hasPassword ?changePasswordSchema : setPasswordSchema),
    defaultValues: { old_password: '', password: '', confirmPassword: '' },
  });

  const getErrorMessage = (error) => {
    const msg = error?.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
  };

  const onSubmit = async (data) => {
    try {
      const res = await ChangePassword({ old_password: data.old_password, password: data.password });
      if (res?.status?.success) {
        toast.success(res?.message || 'Password changed successfully');
        reset();
        router.push('/dashboard/settings');
      } else {
        toast.error(res?.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  //set Password submit
   const setPasswordSubmit = async (data) => {
    try {
      const res = await SetPassword({password: data.password });
      if (res?.status?.success) {
        toast.success(res?.message || 'Password Set successfully');
        reset();
        router.push('/dashboard/settings');
      } else {
        toast.error(res?.message || 'Failed to Set password');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div>
        <PageHeader title={hasPassword?"Change Password" :"Set Password" }/>
      </div>

      {/* Form card */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={hasPassword ? handleSubmit(onSubmit):handleSubmit(setPasswordSubmit)}
          className="flex flex-col gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 w-full max-w-lg"
        >
          {
            hasPassword && (
              <InputPassword
            name="old_password"
            label="Existing Password"
            placeholder="Enter Password"
            register={register}
            errors={errors}
          />
            )
          }

          <InputPassword
            name="password"
            label="New Password"
            placeholder="Enter Password"
            register={register}
            errors={errors}
          />

          <InputPassword
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Enter Password"
            register={register}
            errors={errors}
          />

          {/* Save button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-3.5 rounded-2xl font-semibold text-white text-sm bg-primary-gradient hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
