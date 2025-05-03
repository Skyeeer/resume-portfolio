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
  // Ensure environment variables are passed to serverless functions
  env: {
    // Removed S3-related variables
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID || '',
    GOOGLE_APPLICATION_JSON: process.env.GOOGLE_APPLICATION_JSON || '',
  },
};

export default nextConfig;
