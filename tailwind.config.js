/** Safe Tailwind config: wide globs so purge won't strip classes */
let typography;
try { typography = require('@tailwindcss/typography'); } catch { typography = null; }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [typography].filter(Boolean),
};
