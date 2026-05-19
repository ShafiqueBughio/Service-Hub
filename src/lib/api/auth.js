import api, { refreshAccessToken } from "@/lib/api/client";
import { buildProfileFormData } from "@/lib/api/buildFormData";

export const SignUp = async (payload) => {
  const response = await api.post("/user/register", payload);
  return response.data;
};

export const VerifyOTP = async (payload) => {
  const response = await api.post("/user/verify_otp", payload);
  return response.data;
};

export const ResendOTP = async (payload) => {
  const response = await api.post("/user/resend_otp", payload);
  return response.data;
};

export const CreateUserProfile = async (payload) => {
  const formData = buildProfileFormData(payload);
  const response = await api.post("/user/create_user_profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const CreateContractorProfile = async (payload) => {
  const formData = buildProfileFormData(payload);
  const response = await api.post("/user/create_contractor_profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const RefreshToken = async () => {
  const accessToken = await refreshAccessToken();
  return {
    data: { access_token: accessToken },
    message: accessToken
      ? "New Access Token generated successfully."
      : "Unable to refresh token.",
  };
};

export { default as api } from "@/lib/api/client";
