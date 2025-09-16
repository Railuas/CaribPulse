/** Safe Tailwind config: doesn't crash if typography plugin isn't installed */
let typography;
try { typography = require('@tailwindcss/typography'); } catch { typography = null; }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [typography].filter(Boolean),
};
