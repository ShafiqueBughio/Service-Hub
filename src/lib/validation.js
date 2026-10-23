import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const signUpSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one special character (@ $ ! % * ? &)"
    ),

  confirmPassword: yup.string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const createProfileSchema = yup.object({
  profileImage: yup.mixed().required('Profile image is required'),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  gender: yup.string().oneOf(['male', 'female', 'other']).required("Please select your gender"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

export const contractorStep2Schema = yup.object({
  about: yup.string().required('Please write something about yourself'),

  experiences: yup.array().of(
    yup.object({
      company: yup.string().required('Company is required'),
      jobType: yup.string().required('Job type is required'),
      designation: yup.string().required('Designation is required'),
      startYear: yup
        .number()
        .typeError('Enter a valid year')
        .min(1950, 'Year too old')
        .max(new Date().getFullYear(), 'Cannot be future year')
        .required('Start year is required'),
      endYear: yup
        .number()
        .typeError('Enter a valid year')
        .min(yup.ref('startYear'), 'End year must be after start year')
        .max(new Date().getFullYear() + 1, 'Invalid year')
        .nullable(),
    })
  ).min(1, 'Add at least one experience'),

  serviceAreas: yup
    .array()
    .of(
      yup.object({
        address: yup.string().required('Service area address is required'),
        lat: yup.number().nullable(),
        lng: yup.number().nullable(),
      })
    )
    .min(1, 'Add at least one service area')
    .required('Service area is required'),

  services: yup
    .array()
    .of(yup.string())
    .min(1, 'Add at least one service'),

  portfolioImages: yup
    .array()
    .min(1, 'Please upload at least one portfolio image')
    .required('Portfolio images are required'),
});

const isIdentityFile = (value) =>
  value instanceof File ||
  value instanceof Blob ||
  typeof value === "string" ||
  value?.file instanceof File;

export const identityVerificationSchema = yup.object({
  cnic_front: yup
    .mixed()
    .required("CNIC front is required")
    .test("cnic-front-file", "CNIC front is required", isIdentityFile),
  cnic_back: yup
    .mixed()
    .required("CNIC back is required")
    .test("cnic-back-file", "CNIC back is required", isIdentityFile),
  selfie: yup
    .mixed()
    .required("Live selfie is required")
    .test("selfie-file", "Live selfie is required", isIdentityFile),
});


export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one special character (@ $ ! % * ? &)"
    ),
  confirmPassword: yup.string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const changePasswordSchema = yup.object({
  old_password: yup.string()
    .required("Existing password is required"),

  password: yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain at least one special character (@ $ ! % * ? &)"
    ),

  confirmPassword: yup.string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

//Set Password Schema
export const setPasswordSchema = yup.object({
  password: yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain at least one special character (@ $ ! % * ? &)"
    ),

  confirmPassword: yup.string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});


export const editUserProfileSchema = yup.object({
  first_name:    yup.string().required('First name is required'),
  last_name:     yup.string().required('Last name is required'),
  address:       yup.string().required('Address is required'),
  city:          yup.string().required('City is required'),
  state:         yup.string().required('State is required'),
  contact_phone: yup.string().optional(),
  email:         yup.string().email('Enter a valid email').required('Email is required'),
  gender:        yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required('Gender is required'),
});

export const editContractorProfileSchema = yup.object({
  first_name:    yup.string().required('First name is required'),
  last_name:     yup.string().required('Last name is required'),
  address:       yup.string().required('Address is required'),
  city:          yup.string().required('City is required'),
  state:         yup.string().required('State is required'),
  contact_phone: yup.string().optional(),
  email:         yup.string().email('Enter a valid email').required('Email is required'),
  gender:        yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required('Gender is required'),
  about:         yup.string().optional(),
  experiences:   yup.array().of(yup.object({
    company:     yup.string().optional(),
    designation: yup.string().optional(),
    job_type:    yup.string().optional(),
    start_year:  yup.string().optional(),
    end_year:    yup.string().optional(),
  })).optional(),
});

export const reportIssueSchema = yup.object({
  Subject : yup.string().required("Subject is required").max(100,"Subject must be maximum of 100 characters"),

  Description : yup.string().required("Please add some description of the issue"),

  Attachment : yup
    .array()
    .min(1, 'Please upload at least one Attachment')
    .required('Attachment images are required'),
})
