// Adds DOM matchers such as toBeInTheDocument() to Vitest's expect().
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount rendered components and reset storage after each test so tests stay independent.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
