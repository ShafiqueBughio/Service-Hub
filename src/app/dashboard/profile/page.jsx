"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useProfileStore from "@/lib/store/profileStore";

import PageHeader from "@/components/general/PageHeader";

import { MdEdit, MdCheckCircle } from "react-icons/md";
import { FaUser } from "react-icons/fa";

// ─── Detail row ───────────────────────────────────────────────────────────────

const DetailRow = ({
  label,
  value,
  verified = false,
  multiline = false,
  last = false,
}) => (
  <div
    className={`
      px-4 sm:px-5 py-4
      ${!last ? "border-b border-gray-100" : ""}
    `}
  >
    {multiline ? (
      <>
        <p className="text-sm font-bold text-gray-800 mb-1">
          {label}
        </p>

        <p className="text-sm text-gray-500 leading-relaxed break-words">
          {value || "—"}
        </p>
      </>
    ) : (
      <div
        className="
          flex flex-col
          xs:flex-row
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-1 sm:gap-4
        "
      >
        <p className="text-sm font-bold text-gray-800 shrink-0">
          {label}
        </p>

        <div className="flex items-center gap-1.5 min-w-0">
          {verified && (
            <MdCheckCircle
              size={16}
              className="text-green-500 shrink-0"
            />
          )}

          <p className="text-sm text-gray-500 break-words sm:text-right">
            {value || "—"}
          </p>
        </div>
      </div>
    )}
  </div>
);

// ─── Profile details ──────────────────────────────────────────────────────────

const getProfileDetails = (profile) => {
  const details = profile?.user_details;

  const firstName = details?.first_name || "";
  const lastName = details?.last_name || "";

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "—";

  const gender = details?.gender
    ? details.gender.charAt(0) +
    details.gender.slice(1).toLowerCase()
    : "—";

  return {
    fullName,
    email: profile?.email || "—",
    phone: details?.contact_phone || profile?.phone || "—",
    address: details?.address || "—",
    city: details?.city || "—",
    state: details?.state || "—",
    gender,
    profilePicture: details?.profile_picture || null,
    emailVerified: !!profile?.is_email_verified,
    phoneVerified: !!profile?.is_phone_verified,
  };
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = () => {
  const router = useRouter();

  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    console.log("User Profile Data:", profile);
  }, [profile]);

  const profileData = getProfileDetails(profile);

  const detailRows = [
    {
      label: "Full Name",
      value: profileData.fullName,
    },
    {
      label: "Address",
      value: profileData.address,
      multiline: true,
    },
    {
      label: "City",
      value: profileData.city,
    },
    {
      label: "State",
      value: profileData.state,
    },
    {
      label: "Gender",
      value: profileData.gender,
    },
    {
      label: "Email",
      value: profileData.email,
      verified: profileData.emailVerified,
    },
    {
      label: "Phone Number",
      value: profileData.phone,
      verified: profileData.phoneVerified,
    },
  ];

  return (
    <div className="h-full flex flex-col ">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <PageHeader title="Profile" />
      </div>

      {/* Main Card */}
      <div className="w-full h-full overflow-y-auto bg-white rounded-md p-3 sm:p-4">
        <div className="w-full ">
          {/* Section */}
          <div className="w-full flex flex-col gap-3 sm:gap-4">
            <h4 className="font-semibold text-base sm:text-lg">
              Profile overview
            </h4>

            {/* Avatar + Name */}
            <div
              className="
                w-full
                flex flex-col
                items-center
                justify-center
                text-center
                rounded-md
                gap-2
                bg-gray-100
                p-5 sm:p-6
              "
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {profileData?.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.fullName}
                    className="
                      w-20 h-20
                      sm:w-24 sm:h-24
                      rounded-full
                      object-cover
                      border-2
                      border-white
                      shadow
                    "
                  />
                ) : (
                  <div
                    className="
                      w-20 h-20
                      sm:w-24 sm:h-24
                      rounded-full
                      bg-primary-gradient
                      flex items-center justify-center
                      shadow
                    "
                  >
                    <FaUser
                      size={28}
                      className="text-white sm:hidden"
                    />

                    <FaUser
                      size={32}
                      className="text-white hidden sm:block"
                    />
                  </div>
                )}

                {/* Edit Button */}
                <button
                  onClick={() =>
                    router.push("/dashboard/profile/edit")
                  }
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-7 h-7
                    bg-primary
                    rounded-full
                    flex items-center justify-center
                    border-2
                    border-white
                    shadow
                    cursor-pointer
                    hover:opacity-90
                    transition-opacity
                  "
                  aria-label="Edit profile"
                >
                  <MdEdit size={14} className="text-white" />
                </button>
              </div>

              {/* Name + Email */}
              <div className="max-w-full px-2">
                <h2
                  className="
                    text-base
                    sm:text-lg
                    font-bold
                    text-gray-900
                    break-words
                  "
                >
                  {profileData?.fullName}
                </h2>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    text-gray-400
                    break-all
                  "
                >
                  {profileData?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div
            className="
              mt-4
              sm:mt-5
              grid
              grid-cols-1
              md:grid-cols-2
              gap-x-4
            "
          >
            {detailRows.map((row, index) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
                verified={row.verified}
                multiline={row.multiline}
                last={index === detailRows.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;