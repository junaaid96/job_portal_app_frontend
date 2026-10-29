"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {}; // the value never changes after mount

/**
 * Returns false during server rendering / hydration and true in the browser.
 * Useful to avoid "hydration mismatch" when output depends on localStorage.
 */
export function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
