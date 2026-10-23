"use client";

import React from "react";
import IdentityVerificationForm from "@/components/identity/IdentityVerificationForm";

const ContractorStep3Form = ({
  onBack,
  onSubmit,
  savedData,
  isSubmitting = false,
}) => {
  return (
    <IdentityVerificationForm
      onBack={onBack}
      onSubmit={onSubmit}
      defaultValues={savedData}
      isSubmitting={isSubmitting}
      submitText="Submit"
    />
  );
};

export default ContractorStep3Form;
