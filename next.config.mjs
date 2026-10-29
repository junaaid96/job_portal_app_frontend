// Next.js configuration. The JSDoc type gives editor autocompletion.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // run extra dev-only checks (double-invokes effects) to catch bugs early
  reactCompiler: false, // set to true (and install babel-plugin-react-compiler) to auto-memoize components
};

export default nextConfig;
