"use client"
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contractorStep3Schema } from '@/lib/validation';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import Button from '@/components/ui/Button';

const ContractorStep3Form = ({
  onBack,
  onSubmit,
  savedData,
  portfolioImages,
  setPortfolioImages,
}) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contractorStep3Schema),
    defaultValues: savedData ?? { portfolioImages: [] },
  });

  // keep RHF in sync with page-level portfolioImages state
  useEffect(() => {
    setValue('portfolioImages', portfolioImages, { shouldValidate: false });
  }, [portfolioImages, setValue]);

  const handleImagesChange = (imgs) => {
    setPortfolioImages(imgs);
    // trigger RHF update immediately so validation reflects current state
    setValue('portfolioImages', imgs, { shouldValidate: true });
  };

  const handleFormSubmit = async (data) => {
    await onSubmit({ portfolioImages: data.portfolioImages });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='w-full flex-1 min-h-0 flex flex-col gap-5'
    >
      <div className='flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 pr-1'>
        <MultiImageUpload
          label='Portfolio Images'
          value={portfolioImages}
          onChange={handleImagesChange}
          error={errors.portfolioImages?.message}
        />
      </div>

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
            text={isSubmitting ? 'Submitting...' : 'Submit'}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default ContractorStep3Form;
