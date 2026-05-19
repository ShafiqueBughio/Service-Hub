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
import useProfileStore from '@/lib/store/profileStore';
import { useRouter } from 'next/navigation';
import { CreateUserProfile, CreateContractorProfile } from '@/lib/api/auth';
import {
  buildUserProfilePayload,
  buildContractorProfilePayload,
} from '@/lib/profile/helpers';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 3;

const getErrorMessage = (error) => {
  const msg = error?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong';
};

const page = () => {
  const role = useAuthStore((state) => state.role);
  const setProfile = useProfileStore((state) => state.setProfile);
  const isContractor = role === 'CONTRACTOR';
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

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

  const handleProfileSuccess = (response) => {
    const userDetails = response?.data?.userDetails;
    if (userDetails) {
      setProfile({
        ...userDetails,
        user: response?.data?.user ?? null,
      });
    }
    toast.success(response?.message || 'Profile created successfully!');
    router.push('/dashboard');
  };

  const onStep1Submit = async (data) => {
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }

    const step1 = { ...data, phone };
    saveStepData(1, step1);

    if (isContractor) {
      setCurrentStep(2);
      return;
    }

    setIsSubmittingProfile(true);
    try {
      const payload = buildUserProfilePayload(data, phone);
      const response = await CreateUserProfile(payload);
      if (response?.status?.success) {
        handleProfileSuccess(response);
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onStep2Submit = async (data) => {
    saveStepData(2, { ...data, businessLicense, certifications });
    setCurrentStep(3);
  };

  const onStep3Submit = async (data) => {
    const step3 = { ...data, portfolioImages };
    saveStepData(3, step3);

    const step2WithFiles = {
      ...stepsData.step2,
      businessLicense,
      certifications,
    };

    setIsSubmittingProfile(true);
    try {
      const payload = buildContractorProfilePayload(
        stepsData.step1,
        step2WithFiles,
        step3
      );
      const response = await CreateContractorProfile(payload);

      if (response?.status?.success) {
        handleProfileSuccess(response);
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmittingProfile(false);
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
    isSubmitting: isSubmitting || isSubmittingProfile,
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
          isSubmitting={isSubmittingProfile}
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
      <Title title={currentStep === 3 ? 'Add Portfolio' : 'Create Profile'} />
      {content}
    </div>
  );
};

export default page;
