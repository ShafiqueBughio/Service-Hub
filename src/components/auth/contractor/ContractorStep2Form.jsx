"use client"
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contractorStep2Schema } from '@/lib/validation';
import ExperienceFields from './ExperienceFields';
import ServiceAreaInput from '@/components/ui/ServiceAreaInput';
import ServicesTagInput from '@/components/ui/ServicesTagInput';
import DocumentUpload from '@/components/ui/DocumentUpload';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { IoAdd } from 'react-icons/io5';

const ContractorStep2Form = ({
  onNext,
  onBack,
  savedData,
  businessLicense,
  setBusinessLicense,
  certifications,
  setCertifications,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contractorStep2Schema),
    defaultValues: savedData ?? {
      about: '',
      experiences: [{ company: '', jobType: '', designation: '', startYear: '', endYear: '' }],
      serviceArea: { address: '', lat: null, lng: null },
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' });

  const onSubmit = async (data) => {
    await onNext({ ...data, businessLicense, certifications });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full flex-1 min-h-0 flex flex-col gap-5'
    >
      {/* scrollable content */}
      <div className='flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 pr-1'>

        {/* About */}
        <TextArea
          name='about'
          label='About'
          register={register}
          errors={errors}
          placeholder='About yourself'
          rows={5}
        />

        {/* Experience */}
        <div className='flex flex-col gap-3'>
          <label className='text-sm font-medium text-gray-700'>Experience</label>

          {fields.map((field, idx) => (
            <div key={field.id} className='flex flex-col gap-3'>
              {idx > 0 && (
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-400'>Experience {idx + 1}</span>
                  <button
                    type='button'
                    onClick={() => remove(idx)}
                    className='text-red-400 text-xs hover:text-red-600'
                  >
                    Remove
                  </button>
                </div>
              )}
              <ExperienceFields index={idx} register={register} errors={errors} />
            </div>
          ))}

          {/* Add More */}
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => append({ company: '', jobType: '', designation: '', startYear: '', endYear: '' })}
              className='flex items-center gap-1 text-sm text-primary font-semibold'
            >
              <span className='w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center'>
                <IoAdd size={16} />
              </span>
              Add More
            </button>
          </div>
          {errors.experiences?.message && (
            <p className='text-red-500 text-sm'>{errors.experiences.message}</p>
          )}
        </div>

        {/* Service Areas */}
        <Controller
          name='serviceArea'
          control={control}
          render={({ field }) => (
            <ServiceAreaInput
              value={field.value}
              onChange={field.onChange}
              error={errors.serviceArea?.address?.message || errors.serviceArea?.message}
            />
          )}
        />

        {/* Services */}
        <Controller
          name='services'
          control={control}
          render={({ field }) => (
            <ServicesTagInput
              value={field.value}
              onChange={field.onChange}
              error={errors.services?.message}
            />
          )}
        />

        {/* Verification Documents */}
        <div className='flex flex-col gap-4'>
          <label className='text-sm font-bold text-gray-800'>Verification Documents</label>

          <DocumentUpload
            label='Business License'
            value={businessLicense}
            onChange={setBusinessLicense}
            error={!businessLicense ? errors.businessLicense?.message : undefined}
          />

          <DocumentUpload
            label='Certifications'
            value={certifications}
            onChange={setCertifications}
          />
        </div>
      </div>

      {/* action buttons */}
      <div className='flex gap-3 shrink-0 mt-2'>
        <button
          type='button'
          onClick={onBack}
          className='flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors'
        >
          Back
        </button>
        <div className='flex-1'>
          <Button
            text={isSubmitting ? 'Saving...' : 'Continue'}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default ContractorStep2Form;
