let typography;
try { typography = require('@tailwindcss/typography'); } catch { typography = null; }

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: { extend: {} },
  plugins: [typography].filter(Boolean),
};
