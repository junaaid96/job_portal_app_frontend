"use client"; // hooks that touch the browser only run in Client Components

import { useEffect, useSyncExternalStore } from "react";
import { clearToken, getToken, msUntilExpiry, saveToken, subscribe } from "@/app/lib/auth";
import { getUsername } from "@/app/lib/jwt";

/**
 * Custom hook: any component can call useAuth() to know who is logged in.
 * Custom hooks are just functions whose names start with "use" and that call other hooks.
 */
export function useAuth() {
  // useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  // re-renders this component whenever the store emits a change.
  const token = useSyncExternalStore(subscribe, getToken, () => null);

  // Side effect: schedule an automatic logout exactly when the token expires.
  useEffect(() => {
    const ms = msUntilExpiry();
    if (ms === null) return undefined; // nothing to schedule
    const id = setTimeout(clearToken, ms);
    return () => clearTimeout(id); // cleanup runs when the token changes or on unmount
  }, [token]); // re-run only when the token changes

  return {
    token,
    username: token ? getUsername(token) : null,
    isLoggedIn: Boolean(token),
    login: saveToken,
    logout: clearToken,
  };
}
