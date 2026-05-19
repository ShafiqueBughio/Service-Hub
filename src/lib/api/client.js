"use client";

import axios from "axios";
import useTokenStore from "@/lib/store/tokenStore";

/** Routes that do NOT require access token (no refresh attempt) */
const PUBLIC_ROUTES = [
  "/user/register",
  "/user/verify_otp",
  "/user/resend_otp",
  "/user/login",
  "/user/forget_password",
  "/user/reset_password",
];

let refreshPromise = null;

const isPublicRoute = (url = "") =>
  PUBLIC_ROUTES.some((route) => url.includes(route));

const requiresAccessToken = (url = "") => !isPublicRoute(url);

/**
 * Refresh access token using httpOnly refresh_token cookie.
 * Returns new token or null if unauthorized.
 */
export const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/refresh_token`,
        {},
        { withCredentials: true }
      );

      const accessToken = res?.data?.access_token ?? null;

      if (accessToken) {
        useTokenStore.getState().setAccessToken(accessToken);
        return accessToken;
      }

      useTokenStore.getState().clearAccessToken();
      return null;
    } catch {
      useTokenStore.getState().clearAccessToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";

    if (!requiresAccessToken(url)) {
      return config;
    }

    let token = useTokenStore.getState().accessToken;

    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
