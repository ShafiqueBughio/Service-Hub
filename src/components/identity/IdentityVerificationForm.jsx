"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { identityVerificationSchema } from "@/lib/validation";
import IdentityDocUpload from "./IdentityDocUpload";
import LiveSelfieCapture from "./LiveSelfieCapture";
import Button from "@/components/ui/Button";

/**
 * Reusable identity verification form (CNIC front + back + live selfie).
 * Can be reused later for USER create-profile as well.
 */
const IdentityVerificationForm = ({
  onSubmit,
  onBack,
  isSubmitting = false,
  defaultValues,
  submitText = "Submit",
  showHeading = true,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: yupResolver(identityVerificationSchema),
    defaultValues: {
      cnic_front: defaultValues?.cnic_front ?? null,
      cnic_back: defaultValues?.cnic_back ?? null,
      selfie: defaultValues?.selfie ?? null,
    },
  });

  const submitting = isSubmitting || isFormSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex-1 min-h-0 flex flex-col gap-5"
    >
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 pr-1">
        {showHeading && (
          <div>
            <p className="text-md text-gray-500 mt-1">
              Upload both sides of your CNIC and take a live selfie.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="cnic_front"
            control={control}
            render={({ field }) => (
              <IdentityDocUpload
                label="CNIC Front"
                value={field.value}
                onChange={field.onChange}
                error={errors.cnic_front?.message}
              />
            )}
          />
          <Controller
            name="cnic_back"
            control={control}
            render={({ field }) => (
              <IdentityDocUpload
                label="CNIC Back"
                value={field.value}
                onChange={field.onChange}
                error={errors.cnic_back?.message}
              />
            )}
          />
        </div>

        <Controller
          name="selfie"
          control={control}
          render={({ field }) => (
            <LiveSelfieCapture
              label="Live Selfie"
              value={field.value}
              onChange={field.onChange}
              error={errors.selfie?.message}
            />
          )}
        />
      </div>

      <div className="flex gap-3 shrink-0 mt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back
          </button>
        )}
        <div className="flex-1">
          <Button text={submitText} isSubmitting={submitting} />
        </div>
      </div>
    </form>
  );
};

export default IdentityVerificationForm;
