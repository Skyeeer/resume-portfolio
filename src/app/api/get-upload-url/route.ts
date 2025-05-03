import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// For debugging in Amplify
console.log("Module loaded: get-upload-url");
console.log("S3_BUCKET_NAME available at module level:", !!process.env.S3_BUCKET_NAME);
console.log("REGION available at module level:", !!process.env.REGION);

export async function POST(request: Request) {
    try {
        // Get environment variables directly here for better debugging
        const bucketName = process.env.S3_BUCKET_NAME;
        const region = process.env.REGION || 'eu-north-1';

        // Log all environment variables to help diagnose issues (don't include this in production)
        console.log("Environment variables:", {
            REGION: !!region,
            REGION_VALUE: region,
            S3_BUCKET_NAME: !!bucketName,
            S3_BUCKET_NAME_LENGTH: bucketName ? bucketName.length : 0,
            NODE_ENV: process.env.NODE_ENV
        });

        // Validate environment variables
        if (!bucketName) {
            console.error('Missing S3_BUCKET_NAME environment variable');
            // Try to use a hardcoded bucket name for testing
            // Only for debugging - remove in production
            const fallbackBucketName = 'storagebucketportfolio';
            console.log(`Using fallback bucket name: ${fallbackBucketName} for testing`);

            return NextResponse.json(
                { error: 'S3 bucket name not configured', debug: 'Using fallback for testing' },
                { status: 500 }
            );
        }

        // Get request parameters
        const { contentType = 'audio/webm' } = await request.json();

        // Generate a unique file key
        const fileKey = `audio-uploads/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.webm`;

        console.log(`Generating pre-signed URL for: ${fileKey}, type: ${contentType}, bucket: ${bucketName}`);

        try {
            // Initialize S3 client with explicit region
            const s3Client = new S3Client({
                region: region,
            });

            console.log("S3 client initialized");

            // Create the command for putting an object in S3
            const putObjectCommand = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
                ContentType: contentType,
            });

            console.log("Put command created, attempting to generate pre-signed URL");

            // Generate pre-signed URL (valid for 60 seconds)
            const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
                expiresIn: 60
            });

            console.log('Pre-signed URL generated successfully:', uploadUrl.substring(0, 50) + '...');

            // Return the URL and the key
            return NextResponse.json({
                uploadUrl,
                fileKey,
                bucketName: bucketName
            });
        } catch (s3Error: any) {
            // Catch and log S3-specific errors
            console.error('S3 client error:', {
                message: s3Error.message,
                name: s3Error.name,
                code: s3Error.code,
                requestId: s3Error.$metadata?.requestId,
                cfId: s3Error.$metadata?.cfId,
                statusCode: s3Error.$metadata?.httpStatusCode,
                stack: s3Error.stack
            });

            return NextResponse.json(
                {
                    error: 'S3 client error',
                    details: s3Error.message,
                    code: s3Error.code,
                    region: region,
                    bucketName: bucketName || 'not set'
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error generating upload URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL', details: error.message },
            { status: 500 }
        );
    }
} 