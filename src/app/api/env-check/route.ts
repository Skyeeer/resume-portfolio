import { NextResponse } from 'next/server';

export async function GET() {
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.REGION;

    console.log("Environment check:", {
        S3_BUCKET_NAME: s3BucketName ? "Set (value hidden)" : "Not set",
        S3_BUCKET_NAME_LENGTH: s3BucketName ? s3BucketName.length : 0,
        REGION: region || "Not set",
        NODE_ENV: process.env.NODE_ENV || "Not set",
    });

    // For security, don't return actual values in production
    return NextResponse.json({
        environment: {
            S3_BUCKET_NAME: s3BucketName ? "Set (value hidden)" : "Not set",
            S3_BUCKET_NAME_LENGTH: s3BucketName ? s3BucketName.length : 0,
            REGION: region || "Not set",
            NODE_ENV: process.env.NODE_ENV || "Not set",
        },
        nextConfig: {
            // This will tell us if the Next.js config env values are being properly passed
            envConfigured: typeof process.env.S3_BUCKET_NAME === 'string'
        }
    });
} 