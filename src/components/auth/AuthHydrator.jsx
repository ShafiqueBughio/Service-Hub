"use client";

import { useEffect } from "react";
import useTokenStore from "@/lib/store/tokenStore";
import { getAccessTokenFromCookie } from "@/lib/auth-cookie";

/** Sync Zustand token from cookie on page load (for API client after refresh) */
export default function AuthHydrator({ children }) {
  useEffect(() => {
    const cookieToken = getAccessTokenFromCookie();
    if (cookieToken && !useTokenStore.getState().accessToken) {
      useTokenStore.getState().setAccessToken(cookieToken);
    }
  }, []);

  return children;
}
