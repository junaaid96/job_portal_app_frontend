// A tiny client-side "auth store" built on localStorage.
// React reads it through useSyncExternalStore (see app/hooks/useAuth.js),
// which is the official React way to subscribe to data that lives outside React.
import { getExpiry } from "@/app/lib/jwt";

const TOKEN_KEY = "token"; // localStorage key for the JWT
const FALLBACK_TTL_MS = 30 * 60 * 1000; // 30 min, used if the token has no "exp" claim
const EXPIRY_KEY = "tokenExpiration"; // localStorage key for the fallback expiry
const listeners = new Set(); // components currently subscribed

// Tell every subscriber that the auth state changed.
function emit() {
  listeners.forEach((listener) => listener());
}

/** Read the current token, or null if there is none or it has expired. */
export function getToken() {
  if (typeof window === "undefined") return null; // on the server there is no localStorage
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const expiresAt = getExpiry(token) ?? Number(localStorage.getItem(EXPIRY_KEY));
  if (expiresAt && Date.now() >= expiresAt) return null; // expired tokens count as logged out
  return token;
}

/** Save a token after a successful login. */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + FALLBACK_TTL_MS));
  emit();
}

/** Remove the token (logout or expiry). */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  emit();
}

/** Milliseconds until the current token expires (null if unknown or no token). */
export function msUntilExpiry() {
  const token = getToken();
  if (!token) return null;
  const expiresAt = getExpiry(token) ?? Number(localStorage.getItem(EXPIRY_KEY));
  return expiresAt ? Math.max(0, expiresAt - Date.now()) : null;
}

/** Subscribe function in the shape useSyncExternalStore expects; returns an unsubscribe. */
export function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // fires when ANOTHER tab changes localStorage
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
