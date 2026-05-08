"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import PhoneInput from '@/components/ui/PhoneInput';
import ImageUpload from '@/components/ui/ImageUpload';
import Button from '@/components/ui/Button';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const CreateProfileForm = ({
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
  phone,
  setPhone,
  watch,
  previewUrl,
  setPreviewUrl,
  isSubmitting,
  submitText = 'Continue',
}) => {

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full flex-1 min-h-0 flex flex-col gap-5'
    >
      {/* image upload — shrink-0 so it never gets squished */}
      <Controller
        name='profileImage'
        control={control}
        render={({ field }) => (
          <ImageUpload
            value={field.value}
            onChange={(file, url) => {
              field.onChange(file);
              setPreviewUrl(url); // store preview at page level
            }}
            previewUrl={previewUrl}
            className='shrink-0'
            error={errors?.profileImage?.message}
          />
        )}
      />

      {/* scrollable inputs — takes all remaining height */}
      <div className='flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 pr-1'>
        {/* first + last name row */}
        <div className='grid grid-cols-2 gap-3'>
          <Input
            label='First Name'
            name='firstName'
            type='text'
            placeholder='John'
            register={register}
            errors={errors}
          />
          <Input
            label='Last Name'
            name='lastName'
            type='text'
            placeholder='Smith'
            register={register}
            errors={errors}
          />
        </div>

        {/* address */}
        <Input
          label='Address'
          name='address'
          type='text'
          placeholder='Enter your Address'
          register={register}
          errors={errors}
        />

        {/* city + state row */}
        <div className='grid grid-cols-2 gap-3'>
          <Input
            label='City'
            name='city'
            type='text'
            placeholder='Enter your City'
            register={register}
            errors={errors}
          />
          <Input
            label='State'
            name='state'
            type='text'
            placeholder='Enter your State'
            register={register}
            errors={errors}
          />
        </div>

        {/* gender dropdown */}
        <Dropdown
          label='Gender'
          name='gender'
          register={register}
          errors={errors}
          options={GENDER_OPTIONS}
          placeholder='Select your Gender'
        />

        {/* email */}
        <Input
          name='email'
          type='email'
          register={register}
          errors={errors}
          label='Email Address'
          placeholder='alex.murphy@domain.com'
          watch={watch}
        />

        {/* phone number */}
        <PhoneInput
          label='Phone Number'
          name='phone'
          value={phone}
          onChange={setPhone}
          errors={errors}
        />
      </div>

      {/* submit — always visible at bottom */}
      <Button
        text={isSubmitting ? (submitText === 'Next' ? 'Saving...' : 'Continuing...') : submitText}
        isSubmitting={isSubmitting}
        className='shrink-0 mt-2'
      />
    </form>
  );
};

export default CreateProfileForm;
