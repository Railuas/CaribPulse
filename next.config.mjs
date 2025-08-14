/** Disable the app/ directory so Next uses the pages router only */
const nextConfig = {
  experimental: { appDir: false },
  reactStrictMode: false,
};

export default nextConfig;
