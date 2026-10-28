
"use client";

import { Profiler, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  CircleX,
  Clock3,
  FileCheck,
  ShieldCheck,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";


import PageHeader from "@/components/general/PageHeader";
import VerificationResubmissionModal from "@/components/ui/VerificationResubmissionModal";
import useProfileStore from "@/lib/store/profileStore";
import { getIdentityVerificationDetails, makeIdentityVerification, updateIdentityVerification } from "@/lib/api/auth";
import { buildIdentityVerificationPayload } from "@/lib/profile/helpers";

// --------------------------------------------------
// 1. Verification status configuration
// --------------------------------------------------

const STATUS_CONFIG = {
  VERIFIED: {
    title: "Identity Verified",
    description: "Your identity has been successfully verified.",
    label: "Verified",
    icon: BadgeCheck,
    color: "green",
  },

  PENDING: {
    title: "Verification Pending",
    description:
      "Your documents have been submitted and are awaiting admin review.",
    label: "Pending",
    icon: Clock3,
    color: "amber",
  },

  REJECTED: {
    title: "Verification Rejected",
    description:
      "Your documents didn't meet our verification requirements.",
    label: "Rejected",
    icon: CircleX,
    color: "red",
  },

  NOT_SUBMITTED: {
    title: "Identity Not Submitted",
    description:
      "You haven't submitted your identity verification documents yet.",
    label: "Not Submitted",
    icon: ShieldCheck,
    color: "slate",
  },
};

// --------------------------------------------------
// 2. Status color classes
// --------------------------------------------------

const COLOR_CLASSES = {
  green: {
    banner: "border-green-200 bg-green-50",
    icon: "bg-green-600 text-white",
    title: "text-green-800",
    badge: "bg-green-100 text-green-700",
    notice: "border-green-200 bg-green-50 text-green-800",
    button: "bg-green-600 hover:bg-green-700",
  },

  amber: {
    banner: "border-amber-200 bg-amber-50",
    icon: "bg-amber-500 text-white",
    title: "text-amber-800",
    badge: "bg-amber-100 text-amber-800",
    notice: "border-amber-200 bg-amber-50 text-amber-800",
    button: "bg-amber-600 hover:bg-amber-700",
  },

  red: {
    banner: "border-red-200 bg-red-50",
    icon: "bg-red-600 text-white",
    title: "text-red-800",
    badge: "bg-red-100 text-red-700",
    notice: "border-red-200 bg-red-50 text-red-800",
    button: "bg-red-600 hover:bg-red-700",
  },

  slate: {
    banner: "border-slate-200 bg-slate-50",
    icon: "bg-slate-600 text-white",
    title: "text-slate-800",
    badge: "bg-slate-100 text-slate-700",
    notice: "border-blue-200 bg-blue-50 text-blue-800",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

// --------------------------------------------------
// 3. Helper functions
// --------------------------------------------------

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getErrorMessage = (error) => {
  const message = error?.response?.data?.message;

  return Array.isArray(message)
    ? message.join(", ")
    : message || "Something went wrong";
};

// Accept File objects from the upload modal.
// Existing string URLs are preserved as strings.
const toUploadFile = (value) => {
  if (!value) return null;

  if (typeof File !== "undefined" && value instanceof File) {
    return value;
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return value;
  }

  if (
    typeof File !== "undefined" &&
    value.file instanceof File
  ) {
    return value.file;
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
};

// --------------------------------------------------
// 4. Reusable detail row
// --------------------------------------------------

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center">
      <span className="text-sm text-slate-500 sm:w-40">
        {label}
      </span>

      <span className="break-words text-sm font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
}

// --------------------------------------------------
// 5. Identity verification page
// --------------------------------------------------

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProfile, profile } = useProfileStore();

  const [verificationData, setVerificationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Identity verification data from the profile store.
  const verification = profile?.identity_verification;

  // Resolve the current status.
  const paramsStatus = searchParams.get("status");
  const rawStatus = verification?.verification_status;

  const status = STATUS_CONFIG[rawStatus]
    ? rawStatus
    : STATUS_CONFIG[paramsStatus]
      ? paramsStatus
      : "NOT_SUBMITTED";

  const config = STATUS_CONFIG[status];
  const colors = COLOR_CLASSES[config.color];
  const StatusIcon = config.icon;

  // Status flags for conditional rendering.
  const isVerified = status === "VERIFIED";
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  const isNotSubmitted = status === "NOT_SUBMITTED";

  // Verification details.
  const rejectionReason = verification?.rejection_reason;
  const submittedAt = verification?.created_at;
  const reviewedAt = verification?.reviewed_at;
  const reviewedBy = verification?.reviewed_by;

  // Sensitive document URLs should only be provided by a
  // protected endpoint when the user is allowed to access them.
  const sensitiveDetails = {
    cnic_front: verification?.cnic_front ?? null,
    cnic_back: verification?.cnic_back ?? null,
    selfie: verification?.selfie ?? null,
  };

  // ------------------------------------------------
  // 6. Submit / resubmit verification documents
  // ------------------------------------------------

 const getIdentityVerificationSensitiveDetails = async () => {
  try {
    const response = await getIdentityVerificationDetails();

    if (!response?.status?.success) {
      toast.error(
        response?.message || "Unable to load verification documents."
      );
      return false;
    }

    const data = response?.data?.data ?? response?.data;

    // Remove duplicate URL properties before storing.
    const {
      cnic_front_url,
      cnic_back_url,
      selfie_url,
      cnic_front,
      cnic_back,
      selfie,
      ...verificationDetails
    } = data;

    // Keep only one property for each document.
    const updatedVerification = {
      ...verificationDetails,
      cnic_front: cnic_front_url ?? cnic_front ?? null,
      cnic_back: cnic_back_url ?? cnic_back ?? null,
      selfie: selfie_url ?? selfie ?? null,
    };

    // Update local state for modal default values.
    setVerificationData(updatedVerification);

    // Update Zustand while preserving the rest of the profile.
    const currentProfile = useProfileStore.getState().profile;

    setProfile({
      ...currentProfile,
      identity_verification: updatedVerification,
    });

    return true;
  } catch (error) {
    toast.error(getErrorMessage(error));
    return false;
  }
};

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = buildIdentityVerificationPayload(data);

      const response = await makeIdentityVerification(payload);

      if (response?.status?.success) {
        const verificationData = response?.data?.data

        if (verificationData) {
          setProfile({
            ...profile,
            identity_verification: verificationData,
          });
        }
        toast.success(
          response?.message || "Identity verification submitted."
        );

        setIsModalOpen(false);

        // Refresh profile data using your existing profile-fetch
        // action before relying on the stored verification status.
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        toast.error(
          response?.message || "Something went wrong."
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = buildIdentityVerificationPayload(data);

      const response = await updateIdentityVerification(payload);

      if (response?.status?.success) {
        const verificationData = response?.data?.data

        if (verificationData) {
          setProfile({
            ...profile,
            identity_verification: verificationData,
          });
        }
        toast.success(
          response?.message || "Identity verification Updated."
        );

        setIsModalOpen(false);

        // Refresh profile data using your existing profile-fetch
        // action before relying on the stored verification status.
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        toast.error(
          response?.message || "Something went wrong."
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(verificationData, "Verification Data")
  }, [verificationData])

  // ------------------------------------------------
  // 7. Page UI
  // ------------------------------------------------

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 sm:mb-6">
        <PageHeader title="Identity Verification" />
      </div>

      <div className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-md bg-white p-3 pb-8 sm:p-4 sm:py-6">
        {/* Current verification status */}
        <section
          className={`flex items-start gap-4 rounded-xl border p-5 ${colors.banner}`}
        >
          <div className={`rounded-full p-3 ${colors.icon}`}>
            <StatusIcon size={25} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className={`text-lg font-semibold ${colors.title}`}>
              {config.title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {config.description}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
          >
            {config.label}
          </span>
        </section>

        {/* Verification details */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2">
            <FileCheck size={19} className="text-slate-600" />

            <h2 className="font-semibold text-slate-900">
              Verification Details
            </h2>
          </div>

          <DetailRow label="Status" value={config.label} />

          {!isNotSubmitted && (
            <DetailRow
              label="Submitted At"
              value={formatDate(submittedAt)}
            />
          )}

          {isVerified && (
            <>
              <DetailRow
                label="Verified At"
                value={formatDate(reviewedAt)}
              />

              <DetailRow
                label="Verified By"
                value={reviewedBy}
              />
            </>
          )}

          {isRejected && (
            <>
              <DetailRow
                label="Rejected At"
                value={formatDate(reviewedAt)}
              />

              <DetailRow
                label="Reviewed By"
                value={reviewedBy}
              />
            </>
          )}
        </section>

        {/* Rejection reason */}
        {isRejected && (
          <section className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <h3 className="font-semibold text-red-800">
                  Reason for Rejection
                </h3>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-700">
                  {rejectionReason ||
                    "No rejection reason was provided. Please contact support."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Verified notice */}
        {isVerified && (
          <section
            className={`rounded-xl border p-5 ${colors.notice}`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} className="shrink-0" />

              <div>
                <h3 className="font-semibold">
                  Your identity is verified
                </h3>

                <p className="mt-1 text-sm leading-6">
                  Your identity verification has been approved.
                  You can continue using the features available to
                  your account.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Pending notice */}
        {isPending && (
          <section
            className={`rounded-xl border p-5 ${colors.notice}`}
          >
            <div className="flex items-start gap-3">
              <Clock3 size={22} className="shrink-0" />

              <div>
                <h3 className="font-semibold">
                  What happens next?
                </h3>

                <p className="mt-1 text-sm leading-6">
                  Your documents are waiting for admin review.
                  Check this page again for status updates.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Not submitted notice */}
        {isNotSubmitted && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="shrink-0 text-blue-600"
              />

              <div>
                <h3 className="font-semibold text-blue-900">
                  Complete Identity Verification
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Submit your CNIC front, CNIC back and a selfie
                  to complete identity verification.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Start verification / resubmit documents */}
        {(isRejected || isNotSubmitted) && (
          <div>
            <button
              type="button"
              onClick={async () => {
                if (isRejected) {
                  const success = await getIdentityVerificationSensitiveDetails();

                  if (success) {
                    setIsModalOpen(true);
                  }

                  return;
                }

                setVerificationData(null);
                setIsModalOpen(true);
              }}
              disabled={isSubmitting}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${colors.button}`}
            >
              <Upload size={17} />

              {isRejected
                ? "Resubmit Documents"
                : "Start Verification"}
            </button>
          </div>
        )}
      </div>

      {/* Initial submission / resubmission modal */}
      <VerificationResubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={isRejected?handleResubmit:handleSubmit}
        mode={isRejected ? "resubmit" : "initial"}
        defaultValues={sensitiveDetails}
        rejectionReason={rejectionReason}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Page;
