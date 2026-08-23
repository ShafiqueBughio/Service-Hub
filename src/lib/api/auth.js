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

export const ForgotPassword = async (payload) => {
  const response = await api.post("/user/forget_password", payload);
  return response.data;
}

export const VerifyForgotPasswordOTP = async (payload) => {
  const response = await api.post("/user/verify_forget_password_otp", payload);
  return response.data;
}

export const ResetPassword = async (payload, resetToken) => {
  const response = await api.post("/user/reset_password", payload, {
    headers: resetToken ? { Authorization: `Bearer ${resetToken}` } : {},
  });
  return response.data;
}

export const Login = async (payload) => {
  const response = await api.post("/user/login", payload);
  return response.data;
}

export const ResendOTPForForgetPassword = async (payload) => {
  const response = await api.post("/user/resend_otp_for_forget_password", payload);
  return response.data;
}

export const Logout = async () => {
  const response = await api.post("/user/logout");
  return response.data;
}

export const ChangePassword = async (payload) => {
  const response = await api.post("/user/change_password", payload);
  return response.data;
}


export const deleteUser = async()=>{
  const response = await api.delete("/user");
  return response.data;
}


export { default as api } from "@/lib/api/client";
