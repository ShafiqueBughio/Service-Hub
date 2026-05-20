import { create } from "zustand";
import {
  setAccessTokenCookie,
  clearAccessTokenCookie,
} from "@/lib/auth-cookie";

const useTokenStore = create((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => {
    if (accessToken) {
      setAccessTokenCookie(accessToken);
    } else {
      clearAccessTokenCookie();
    }
    set({ accessToken });
  },
  clearAccessToken: () => {
    clearAccessTokenCookie();
    set({ accessToken: null });
  },
}));

export default useTokenStore;
