import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Define environment variable names for clarity
const REGION = process.env.REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function POST(request: Request) {
    try {
        // Log all environment variables to help diagnose issues (don't include this in production)
        console.log("Environment variables:", {
            REGION,
            S3_BUCKET_NAME,
            NODE_ENV: process.env.NODE_ENV
        });

        // Validate environment variables
        if (!S3_BUCKET_NAME) {
            console.error('Missing S3_BUCKET_NAME environment variable');
            return NextResponse.json(
                { error: 'S3 bucket name not configured' },
                { status: 500 }
            );
        }

        // Get request parameters
        const { contentType = 'audio/webm' } = await request.json();

        // Generate a unique file key
        const fileKey = `audio-uploads/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.webm`;

        console.log(`Generating pre-signed URL for: ${fileKey}, type: ${contentType}`);

        try {
            // Initialize S3 client with explicit credentials for testing
            const s3Client = new S3Client({
                region: REGION,
                // Use default credentials provider chain - will use AWS credentials from environment
            });

            console.log("S3 client initialized");

            // Create the command for putting an object in S3
            const putObjectCommand = new PutObjectCommand({
                Bucket: S3_BUCKET_NAME,
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
                bucketName: S3_BUCKET_NAME
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
                    code: s3Error.code
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