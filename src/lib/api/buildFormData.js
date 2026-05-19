const appendFileList = (formData, fieldName, files) => {
  if (!files) return;
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file) => {
    if (file instanceof File) {
      formData.append(fieldName, file);
    }
  });
};

/** Build multipart form data for profile APIs */
export const buildProfileFormData = (payload) => {
  const formData = new FormData();
  const {
    profile_picture,
    business_license,
    certifications,
    portfolio_images,
    ...rest
  } = payload;

  Object.entries(rest).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (value instanceof File) return;
    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (profile_picture instanceof File) {
    formData.append('profile_picture', profile_picture);
  } else if (typeof profile_picture === 'string' && profile_picture) {
    formData.append('profile_picture', profile_picture);
  }

  if (business_license instanceof File) {
    formData.append('business_license', business_license);
  } else if (typeof business_license === 'string' && business_license) {
    formData.append('business_license', business_license);
  }

  appendFileList(formData, 'certifications', certifications);
  appendFileList(formData, 'portfolio_images', portfolio_images);

  return formData;
};
