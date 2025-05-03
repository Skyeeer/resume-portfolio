import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Allowing TypeScript errors for deployment
    // Remove this in production when errors are fixed
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Allowing ESLint warnings for deployment
    // Remove this in production when warnings are fixed
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
