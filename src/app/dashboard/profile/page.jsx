"use client";

import React, { useEffect } from "react";
import useProfileStore from "@/lib/store/profileStore";
import PageHeader from "@/components/general/PageHeader";
import UserProfile from "@/components/ui/UserProfile";
import ContractorProfile from "@/components/ui/ContractorProfile";


// ─── Shared helper — derives common display fields from profile ───────────────
const getProfileData = (profile) => {
  const details = profile?.user_details;
  const identity_verification_details = profile?.identity_verification;
  const firstName = details?.first_name || "";
  const lastName = details?.last_name || "";

  return {
    fullName: [firstName, lastName].filter(Boolean).join(" ") || "—",
    email: profile?.email || "—",
    contact_email : details?.contact_email || "",
    phone: details?.contact_phone || profile?.phone || "—",
    address: details?.address || "—",
    city: details?.city || "—",
    state: details?.state || "—",
    gender: details?.gender
      ? details.gender.charAt(0) + details.gender.slice(1).toLowerCase()
      : "—",
    profilePicture: details?.profile_picture || null,
    emailVerified: !!profile?.is_email_verified,
    phoneVerified: !!profile?.is_phone_verified,
    rejection_reason : identity_verification_details?.rejection_reason,
    verification_status : identity_verification_details?.verification_status,
  };
};


// ─── Page ─────────────────────────────────────────────────────────────────────
const Page = () => {
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    console.log("User Profile Data:", profile);
  }, [profile]);

  const profileData = getProfileData(profile);
  const isContractor = profile?.user_type === "CONTRACTOR";
  const contractorData = profile?.contractor_profile ?? null;

  // DetailRows for the USER profile card
  const detailRows = [
    { label: "Full Name", value: profileData.fullName },
    { label: "Address", value: profileData.address, multiline: true },
    { label: "City", value: profileData.city },
    { label: "State", value: profileData.state },
    { label: "Gender", value: profileData.gender },
    { label: "Contact Email", value: profileData.contact_email, verified: profileData.emailVerified },
    { label: "Phone Number", value: profileData.phone, verified: profileData.phoneVerified },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <PageHeader title="Profile" />
      </div>

      {/* Conditional render based on user_type */}
      {isContractor ? (
        <ContractorProfile
          profileData={profileData}
          contractorData={contractorData}
        />
      ) : (
        <UserProfile detailRows={detailRows} profileData={profileData} />
      )}
    </div>
  );
};

export default Page;
