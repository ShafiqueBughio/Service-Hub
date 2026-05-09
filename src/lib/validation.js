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

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export const createProfileSchema = yup.object({
  profileImage: yup.mixed().required('Profile image is required'),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  gender: yup.string().required("Please select your gender"),
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

  serviceArea: yup.object({
    address: yup.string().required('Service area is required'),
    lat: yup.number().nullable(),
    lng: yup.number().nullable(),
  }).required('Service area is required'),

  services: yup
    .array()
    .of(yup.string())
    .min(1, 'Add at least one service'),
});

export const contractorStep3Schema = yup.object({
  portfolioImages: yup
    .array()
    .min(1, 'Please upload at least one portfolio image')
    .required('Portfolio images are required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});
