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
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
    REGION: process.env.REGION || 'eu-north-1',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
};

export default nextConfig;
