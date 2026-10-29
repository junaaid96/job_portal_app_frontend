// PostCSS runs over every CSS file during the build.
// Tailwind CSS v4 ships as a single PostCSS plugin; no tailwind.config.js is needed.
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // scans your files for class names and generates the CSS
  },
};

export default config;
