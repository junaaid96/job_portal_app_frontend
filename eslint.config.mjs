// ESLint "flat config" (ESLint 9+): an array of config objects applied in order.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals"; // Next.js + React + React Hooks + a11y rules

export default defineConfig([
  ...nextVitals, // spread the Next.js recommended configs into ours
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]), // never lint build output
]);
