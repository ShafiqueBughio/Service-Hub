"use client"
import React, { useState,useEffect, lazy, Suspense } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createJobSchema } from '@/lib/validation';
import { MdClose, MdLocationOn, MdOutlineMyLocation } from 'react-icons/md';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import ServicesTagInput from '@/components/ui/ServicesTagInput';
import toast from 'react-hot-toast';
import LocationPicker from '../ui/location/LocationPicker';



// ─── Field label ──────────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <p className="text-sm font-semibold text-gray-800 mb-2">{children}</p>
);

// ─── Job type radio ───────────────────────────────────────────────────────────
const JobTypeSelector = ({ value, onChange }) => {
  const types = [
    { value: 'REGULAR', label: 'Regular Bid',  hint: 'Only 5 service providers can place bids on your request.' },
    { value: 'LIVE',    label: 'Live Auction',  hint: 'Unlimited service providers can bid live on your job.' },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-6">
        {types.map((t) => (
          <button key={t.value} type="button" onClick={() => onChange(t.value)}
            className="flex items-center gap-2 cursor-pointer">
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
              ${value === t.value ? 'border-primary' : 'border-gray-300'}`}>
              {value === t.value && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </span>
            <span className={`text-sm font-medium ${value === t.value ? 'text-primary' : 'text-gray-600'}`}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        {types.find((t) => t.value === value)?.hint}
      </p>
    </div>
  );
};

const expiry_days = [1,3,5,7];

// ─── Expire days selector ─────────────────────────────────────────────────────
const ExpireDaysSelector = ({ value, onChange, error }) => (
  <div className="flex flex-col gap-2">
    <FieldLabel>Expire in</FieldLabel>
    <div className="grid grid-cols-4 gap-3">
      {expiry_days.map((day) => (
        <button key={day} type="button" onClick={() => onChange(day)}
          className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer
            ${value === day
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'}`}>
          <span className="text-lg font-bold">{String(day).padStart(2, '0')}</span>
          <span className="text-xs mt-0.5">{day === 1 ? 'Day' : 'Days'}</span>
        </button>
      ))}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ─── Location picker — single location via MapPicker ─────────────────────────
// Stores a single { address, lat, lng } object internally, passes address string to RHF

const LocationField = ({ control, errors }) => {
  return (
    <div className="flex flex-col gap-2">
      <Controller
        name="location"
        control={control}
        render={({ field, fieldState }) => (
          <LocationPicker
            label="Location"
            placeholder="Choose where the job is located"
            value={
              field.value
                ? {
                    address: field.value.loc,
                    lat: field.value.latitude,
                    lng: field.value.longitude,
                  }
                : null
            }
            onChange={(location) => {
              field.onChange(
                location
                  ? {
                      loc: location.address,
                      latitude: String(location.lat),
                      longitude: String(location.lng),
                    }
                  : null
              );
            }}
            error={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
};


// ─── Attachments — MultiImageUpload wired to RHF via useController ────────────
const AttachmentsField = ({ control, errors }) => {
  const { field } = useController({
    name: "attachments",
    control,
    defaultValue: [],
  });

  return (
    <div>
      <FieldLabel>Project Documents / Photos</FieldLabel>

      <MultiImageUpload
        value={field.value ?? []}
        onChange={field.onChange}
        error={errors?.attachments?.message}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};



// ─── Main Modal ───────────────────────────────────────────────────────────────
const CreateJobModal = ({ onClose,data= null, onSubmit, mode = "create"}) => {
  const [jobType,    setJobType]    = useState(data?.job_type ||'REGULAR');
  const [expireDays, setExpireDays] = useState(data?.expire_days ?? null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createJobSchema),
    defaultValues: {
      title : data?.title || "",
      description : data?.description || "",
      expire_days : data?.expire_days ?? null,
      job_type: data?.job_type ||  'REGULAR',
      timeline : data?.timeline || "",
      min_budget : data?.min_budget || null,
      max_budget : data?.max_budget || null,
      provider_preferences: data?.provider_preferences || [],
      attachments:   data?.attachments ||  [],
      location:   data?.location ||   null,
    },
  });


    // Reset form when edit data changes
  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        title: data.title || "",
        description: data.description || "",
        expire_days: data.expire_days ?? null,
        job_type: data.job_type || 'REGULAR',
        timeline: data.timeline || "",
        min_budget: data.min_budget ?? "",
        max_budget: data.max_budget ?? "",
        provider_preferences: data.provider_preferences || [],
        attachments: data.attachments || [],
        location: data.location || null,
      });

      setJobType(data.job_type || 'REGULAR');
      setExpireDays(data.expire_days ?? null);
    }
  }, [data, mode, reset]);

  const handleJobTypeChange = (val) => {
    setJobType(val);
    setValue('job_type', val, { shouldValidate: true });
  };

  const handleExpireChange = (val) => {
    setExpireDays(val);
    setValue('expire_days', val, { shouldValidate: true });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90dvh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-center px-5 pt-5 pb-4 border-b border-gray-100 shrink-0 relative">
          <h2 className="text-lg font-bold text-gray-900">{mode === "create"? "Create Job":"Edit Job"}</h2>
          <button type="button" onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close">
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ── Scrollable form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

            {/* Job Type */}
            <div>
              <JobTypeSelector value={jobType} onChange={handleJobTypeChange} />
              {errors.job_type && <p className="text-red-500 text-xs mt-1">{errors.job_type.message}</p>}
            </div>

            {/* Title */}
            <Input name="title" label="Project Title" placeholder="Project Title"
              register={register} errors={errors} type="text" />

            {/* Description */}
            <TextArea name="description" label="Project Description" placeholder="Project Description"
              register={register} errors={errors} rows={4} />

            {/* Expire Days */}
            <ExpireDaysSelector value={expireDays} onChange={handleExpireChange}
              error={errors.expire_days?.message} />

            {/* Budget */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Budget</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <Input name="min_budget" placeholder="Min" register={register} errors={errors} type="number" />
                <Input name="max_budget" placeholder="Max" register={register} errors={errors} type="number" />
              </div>
            </div>

            {/* Timeline */}
            <Input name="timeline" label="Timeline" placeholder="Enter Estimated Timeline"
              register={register} errors={errors} type="text" />

            {/* Location — single pick via MapPicker */}
            <LocationField control={control} errors={errors} />

            {/* Attachments */}
            <AttachmentsField
             control={control}
              errors={errors}
              />

            {/* Provider Preferences */}
            <Controller name="provider_preferences" control={control}
              render={({ field }) => (
                <ServicesTagInput
                  label="Select Provider Preferences"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  error={errors.provider_preferences?.message}
                />
              )} />

          </div>

          {/* ── Sticky footer ── */}
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
            <Button text={mode === "create"?"Post Job":"Save Changes"} isSubmitting={isSubmitting} />
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateJobModal;
