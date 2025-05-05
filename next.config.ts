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
    // AWS Amplify variables
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
    NEXT_PUBLIC_PINPOINT_REGION: process.env.NEXT_PUBLIC_PINPOINT_REGION || 'eu-central-1',
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || '',
    NEXT_PUBLIC_PINPOINT_APP_ID: process.env.NEXT_PUBLIC_PINPOINT_APP_ID || '',
  },
};

export default nextConfig;
