import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const SignUp = async (payload) => {
  const response = await api.post("/user/register", payload);
  return response.data;
};

export const VerifyOTP = async (payload) => {
  const response = await api.post("/user/verify_otp", payload);
  return response.data;
};