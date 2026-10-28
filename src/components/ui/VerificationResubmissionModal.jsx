"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  X,
  Camera,
  FileImage,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { identityVerificationSchema } from "@/lib/validation";
import IdentityDocUpload from "../identity/IdentityDocUpload";
import LiveSelfieCapture from "../identity/LiveSelfieCapture";

// Existing URLs are valid values during resubmission.
// The fields must still contain a document or existing URL.
const identityResubmissionSchema = yup.object({
  cnic_front: yup.mixed().required("CNIC front is required."),
  cnic_back: yup.mixed().required("CNIC back is required."),
  selfie: yup.mixed().required("Live selfie is required."),
});

const DOCUMENTS = [
  {
    key: "cnic_front",
    label: "CNIC Front",
    description: "Upload the front side of your CNIC.",
  },
  {
    key: "cnic_back",
    label: "CNIC Back",
    description: "Upload the back side of your CNIC.",
  },
  {
    key: "selfie",
    label: "Live Selfie",
    description: "Capture a clear photo of yourself.",
  },
];

const getFormValues = (values = {}) => ({
  cnic_front: values.cnic_front ?? null,
  cnic_back: values.cnic_back ?? null,
  selfie: values.selfie ?? null,
});

export default function VerificationResubmissionModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "initial",
  defaultValues,
  rejectionReason,
}) {
  const [submitError, setSubmitError] = useState("");

  const isResubmission = mode === "resubmit";

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      isResubmission
        ? identityResubmissionSchema
        : identityVerificationSchema
    ),
    defaultValues: getFormValues(defaultValues),
  });

  const [cnicFront, cnicBack, selfie] = watch([
    "cnic_front",
    "cnic_back",
    "selfie",
  ]);

  const areDocumentsFilled = Boolean(
    cnicFront && cnicBack && selfie
  );

  // Populate the existing documents when the resubmission data arrives.
  useEffect(() => {
    if (isOpen) {
      reset(getFormValues(defaultValues));
      setSubmitError("");
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submitForm = async (values) => {
    setSubmitError("");

    if (typeof onSubmit !== "function") {
      setSubmitError("Document submission is not configured.");
      return;
    }

    try {
      // values contain File objects for newly selected files.
      // During resubmission, unchanged values can be existing URLs.
      await onSubmit(values);
      reset(getFormValues(defaultValues));
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit documents. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
          overflow-y-auto bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-modal-title"
        className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4
            border-b border-slate-200 p-5 sm:p-6"
        >
          <div>
            <h2
              id="verification-modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              {isResubmission
                ? "Resubmit Documents"
                : "Verify Your Identity"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Upload clear images of your CNIC and capture a live selfie.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500
                hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          {/* Existing rejection reason */}
          {isResubmission && rejectionReason && (
            <div className="mx-5 mt-5 rounded-lg border border-red-200
                bg-red-50 p-4 sm:mx-6"
            >
              <p className="text-sm font-semibold text-red-800">
                Reason for rejection
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                {rejectionReason}
              </p>
            </div>
          )}

          {/* Upload cards */}
          <div className="max-h-[62dvh] overflow-y-auto overscroll-contain
  grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
            {DOCUMENTS.map((document) => (
              <div
                key={document.key}
                className={`flex flex-col rounded-xl border p-4  ${errors[document.key]
                    ? "border-red-300 bg-red-50/30"
                    : "border-dashed border-slate-300 bg-slate-50/60"
                  }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center
                    justify-center rounded-xl bg-blue-50 text-blue-600"
                >
                  {document.key === "selfie" ? (
                    <Camera size={22} />
                  ) : (
                    <FileImage size={22} />
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  {document.label}
                  <span className="ml-1 text-red-500">*</span>
                </h3>

                <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                  {document.description}
                </p>

                <div className="mt-4">
                  <Controller
                    name={document.key}
                    control={control}
                    render={({ field }) =>
                      document.key === "selfie" ? (
                        <LiveSelfieCapture
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.selfie?.message}
                          mode="dashboard"
                        />
                      ) : (
                        <IdentityDocUpload
                          label={document.label}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors[document.key]?.message}
                          className
                        />
                      )
                    }
                  />
                </div>

                <p className="mt-3 text-center text-[11px] text-slate-400">
                  JPG, PNG or WebP
                </p>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          {/* <div className="mx-5 mb-4 flex gap-2 rounded-lg bg-slate-50
              p-3 text-xs leading-5 text-slate-600 sm:mx-6"
            >
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-slate-500"
              />
              <p>
                Your documents contain sensitive personal information.
                They should be securely uploaded and accessible only to
                authorized reviewers.
              </p>
            </div> */}

          {/* API error */}
          {submitError && (
            <p
              role="alert"
              className="mx-5 mb-4 rounded-lg bg-red-50 p-3
                  text-sm text-red-700 sm:mx-6"
            >
              {submitError}
            </p>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t
              border-slate-200 p-5 sm:flex-row sm:justify-end sm:p-6"
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-5 py-3
                  text-sm font-medium text-slate-700 hover:bg-slate-50
                  disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !areDocumentsFilled}
              className="flex items-center justify-center gap-2
                  rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold
                  text-white transition hover:bg-blue-700
                  disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && (
                <LoaderCircle size={17} className="animate-spin" />
              )}

              {isSubmitting
                ? "Submitting..."
                : isResubmission
                  ? "Resubmit Documents"
                  : "Submit Documents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
