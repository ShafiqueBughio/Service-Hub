/** Map form gender values to backend enum: MALE | FEMALE | OTHER */
export const toApiGender = (gender) => {
  if (!gender) return '';
  const normalized = String(gender).toUpperCase();
  if (normalized === 'PREFER_NOT') return 'OTHER';
  return normalized;
};

export const buildUserProfilePayload = (data,stepData, phone) => ({
  first_name: data.firstName,
  last_name: data.lastName,
  address: data.address,
  city: data.city,
  state: data.state,
  contact_phone: phone,
  contact_email : data.email,
  gender: toApiGender(data.gender),
  profile_picture: data.profileImage ?? null,
  cnic_front: toUploadFile(stepData?.cnic_front),
    cnic_back: toUploadFile(stepData?.cnic_back),
    selfie: toUploadFile(stepData?.selfie),
});

const mapExperiencesToApi = (experiences = []) =>
  experiences.map((exp) => ({
    company: exp.company ?? '',
    job_type: exp.jobType ?? '',
    designation: exp.designation ?? '',
    start_year: exp.startYear != null ? String(exp.startYear) : '',
    end_year: exp.endYear != null ? String(exp.endYear) : '',
  }));

const mapServiceAreasToApi = (serviceAreas) => {
  // Support legacy single-object shape from older drafts
  const list = Array.isArray(serviceAreas)
    ? serviceAreas
    : serviceAreas?.address
      ? [serviceAreas]
      : [];

  return list
    .filter((area) => area?.address)
    .map((area) => ({
      location: area.address,
      latitude: area.lat != null ? String(area.lat) : '',
      longitude: area.lng != null ? String(area.lng) : '',
    }));
};

const toUploadFile = (value) => {
  if (!value) return null;
  if (value instanceof File || value instanceof Blob) return value;
  if (value.file instanceof File) return value.file;
  if (typeof value === "string") return value;
  return null;
};

export const buildContractorProfilePayload = (step1, step2, step3) => {
  const certifications = step2.certifications
    ? Array.isArray(step2.certifications)
      ? step2.certifications
      : [step2.certifications]
    : [];

  return {
    ...buildUserProfilePayload(step1, step3, step1.phone),
    about: step2.about ?? '',
    services: step2.services ?? [],
    experiences: mapExperiencesToApi(step2.experiences),
    service_areas: mapServiceAreasToApi(
      step2.serviceAreas ?? step2.serviceArea
    ),
    business_license: step2.businessLicense ?? null,
    certifications,
    portfolio_images:
      step2?.portfolioImages ?? step3?.portfolioImages ?? [],
    
  };
};
