"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createProfileSchema } from '@/lib/validation';
import CreateProfileForm from '@/components/auth/CreateProfileForm';
import ContractorStep2Form from '@/components/auth/contractor/ContractorStep2Form';
import ContractorStep3Form from '@/components/auth/contractor/ContractorStep3Form';
import StepIndicator from '@/components/ui/StepIndicator';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import Title from '@/components/general/Title';
import useAuthStore from '@/lib/store/store';
import { useRouter } from 'next/navigation';

const TOTAL_STEPS = 3;

const page = () => {
  const role = useAuthStore((state) => state.role);
  const isContractor = role === 'contractor';
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // multi-step form data stored in memory only (no localStorage)
  const [stepsData, setStepsData] = useState({
    step1: null,
    step2: null,
    step3: null,
  });

  const saveStepData = (step, data) => {
    setStepsData((prev) => ({ ...prev, [`step${step}`]: data }));
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(createProfileSchema),
    defaultValues: {
      profileImage: null,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      gender: '',
      email: '',
    },
  });

  const [phone, setPhone] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [certifications, setCertifications] = useState(null);

  // Step 1 submit
  const onStep1Submit = async (data) => {
    if (!phone) {
      alert('Phone number is required');
      return;
    }
    if (isContractor) {
      saveStepData(1, { ...data, phone });
      setCurrentStep(2);
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('User profile submitted:', { ...data, phone });
        router.push('/dashboard');
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Step 2 submit
  const onStep2Submit = async (data) => {
    saveStepData(2, data);
    setCurrentStep(3);
  };

  // Step 3 final submit
  const onStep3Submit = async (data) => {
    saveStepData(3, data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fullData = {
        ...stepsData.step1,
        ...stepsData.step2,
        ...data,
      };
      console.log('Contractor full data:', fullData);
    //   router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const formProps = {
    register,
    control,
    errors,
    handleSubmit,
    onSubmit: onStep1Submit,
    phone,
    setPhone,
    watch,
    previewUrl,
    setPreviewUrl,
    isSubmitting,
    submitText: isContractor ? 'Next' : 'Continue',
  };

  const content = (
    <div className='w-full flex-1 min-h-0 flex flex-col gap-5'>

      {isContractor && (
        <StepIndicator totalSteps={TOTAL_STEPS} currentStep={currentStep} />
      )}

      {currentStep === 1 && <CreateProfileForm {...formProps} />}

      {currentStep === 2 && (
        <ContractorStep2Form
          onBack={() => setCurrentStep(1)}
          onNext={onStep2Submit}
          savedData={stepsData.step2}
          businessLicense={businessLicense}
          setBusinessLicense={setBusinessLicense}
          certifications={certifications}
          setCertifications={setCertifications}
        />
      )}

      {currentStep === 3 && (
        <ContractorStep3Form
          onBack={() => setCurrentStep(2)}
          onSubmit={onStep3Submit}
          savedData={stepsData.step3}
          portfolioImages={portfolioImages}
          setPortfolioImages={setPortfolioImages}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <MobileAuthLayout>
        <div className='flex-1 min-h-0 flex flex-col gap-6'>
          {content}
        </div>
      </MobileAuthLayout>
    );
  }

  return (
    <div className='w-full h-full px-12 flex flex-col gap-6 py-10 min-h-0'>
      <Title title={currentStep === 3 ? "Add Portfolio" :"Create Profile"} />
      {content}
    </div>
  );
};

export default page;
