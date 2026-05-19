/** Map form gender values to backend enum: MALE | FEMALE | OTHER */
export const toApiGender = (gender) => {
  if (!gender) return '';
  const normalized = String(gender).toUpperCase();
  if (normalized === 'PREFER_NOT') return 'OTHER';
  return normalized;
};

export const buildUserProfilePayload = (data, phone) => ({
  first_name: data.firstName,
  last_name: data.lastName,
  address: data.address,
  city: data.city,
  state: data.state,
  contact_phone: phone,
  gender: toApiGender(data.gender),
  profile_picture: data.profileImage ?? null,
});

const mapExperiencesToApi = (experiences = []) =>
  experiences.map((exp) => ({
    company: exp.company ?? '',
    job_type: exp.jobType ?? '',
    designation: exp.designation ?? '',
    start_year: exp.startYear != null ? String(exp.startYear) : '',
    end_year: exp.endYear != null ? String(exp.endYear) : '',
  }));

const mapServiceAreasToApi = (serviceArea) => {
  if (!serviceArea?.address) return [];
  return [
    {
      location: serviceArea.address,
      latitude: serviceArea.lat != null ? String(serviceArea.lat) : '',
      longitude: serviceArea.lng != null ? String(serviceArea.lng) : '',
    },
  ];
};

export const buildContractorProfilePayload = (step1, step2, step3) => {
  const certifications = step2.certifications
    ? Array.isArray(step2.certifications)
      ? step2.certifications
      : [step2.certifications]
    : [];

  return {
    ...buildUserProfilePayload(step1, step1.phone),
    about: step2.about ?? '',
    services: step2.services ?? [],
    experiences: mapExperiencesToApi(step2.experiences),
    service_areas: mapServiceAreasToApi(step2.serviceArea),
    business_license: step2.businessLicense ?? null,
    certifications,
    portfolio_images: step3?.portfolioImages ?? [],
  };
};
