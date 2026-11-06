/**
 * Build multipart form data for profile APIs.
 *
 * For fields like certifications and portfolio_images that can be a mix of
 * existing URL strings and new File objects:
 * - Existing URL strings are sent as a single JSON-stringified array field
 *   → backend's parse_multipart_json_fields middleware parses it back to array
 * - New File objects are sent as individual binary fields with the same key
 *   → multer picks them up, upload_media uploads them, mergeProfileMedia merges URLs
 */
export const buildProfileFormData = (payload) => {
  const formData = new FormData();
  const {
    profile_picture,
    business_license,
    certifications,
    portfolio_images,
    cnic_front,
    cnic_back,
    selfie,
    ...rest
  } = payload;

  // Scalar and object fields
  Object.entries(rest).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (value instanceof File) return;
    if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  // profile_picture — single file or URL string
  if (profile_picture instanceof File) {
    formData.append('profile_picture', profile_picture);
  } else if (typeof profile_picture === 'string' && profile_picture) {
    formData.append('profile_picture', profile_picture);
  }

  // business_license — single file or URL string
  if (business_license instanceof File) {
    formData.append('business_license', business_license);
  } else if (typeof business_license === 'string' && business_license) {
    formData.append('business_license', business_license);
  }

  // certifications — split into existing URLs (JSON array) and new Files (binary)
  if (certifications !== undefined) {
    const items = Array.isArray(certifications) ? certifications : [];
    const existingUrls = items.filter((i) => typeof i === 'string');
    // unwrap { file, url } wrapper objects from MultiImageUpload
    const newFiles = items
      .map((i) => i instanceof File ? i : i?.file)
      .filter((f) => f instanceof File);

    formData.append('certifications', JSON.stringify(existingUrls));
    newFiles.forEach((file) => formData.append('certifications', file));
  }

  // portfolio_images — same pattern
  if (portfolio_images !== undefined) {
    const items = Array.isArray(portfolio_images) ? portfolio_images : [];
    const existingUrls = items.filter((i) => typeof i === 'string');
    // unwrap { file, url } wrapper objects from MultiImageUpload
    const newFiles = items
      .map((i) => i instanceof File ? i : i?.file)
      .filter((f) => f instanceof File);

    formData.append('portfolio_images', JSON.stringify(existingUrls));
    newFiles.forEach((file) => formData.append('portfolio_images', file));
  }

  const appendIdentityFile = (key, value) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'string' && value) {
      formData.append(key, value);
    }
  };

  appendIdentityFile('cnic_front', cnic_front);
  appendIdentityFile('cnic_back', cnic_back);
  appendIdentityFile('selfie', selfie);

  return formData;
};

/**
 * Build FormData for job create/edit.
 * - Scalar fields → appended as strings
 * - Arrays/objects (non-file) → JSON.stringify
 * - `attachments` field: existing { url, type } objects → JSON array,
 *   new File objects → binary under 'attachments' field (multer picks them up)
 */
export const buildJobFormData = (payload) => {
  const formData = new FormData();
  const { attachments, ...rest } = payload;

  // Scalar and object fields
  Object.entries(rest).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (value instanceof File) { formData.append(key, value); return; }
    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {      formData.append(key, String(value));
    }
  });

  // Attachments — split existing URLs from new File objects
  if (attachments !== undefined) {
    const items       = Array.isArray(attachments) ? attachments : [];
    const existingURLs = items.filter((a) => typeof a?.url === 'string' && !a?.url?.startsWith('blob:'));
    const newFiles     = items
      .map((a) => a instanceof File ? a : a?.file)
      .filter((f) => f instanceof File);

    // Send existing as JSON (backend merges them)
    formData.append('attachments', JSON.stringify(existingURLs));

    // Send new files as binary under 'attachments' — multer + upload_media handles them
    newFiles.forEach((file) => formData.append('attachments', file));
  }

  return formData;
};

