const ACCESS_TOKEN_COOKIE = "access_token";
const MAX_AGE_SEC = 7 * 24 * 60 * 60; // 7 days

export const setAccessTokenCookie = (token) => {
  if (typeof document === "undefined" || !token) return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax`;
};

export const clearAccessTokenCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

export const getAccessTokenFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_TOKEN_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
};
