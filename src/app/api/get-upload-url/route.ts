import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Define environment variable names for clarity
const REGION = process.env.REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function POST(request: Request) {
    try {
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

        // Initialize S3 client
        const s3Client = new S3Client({
            region: REGION,
        });

        // Create the command for putting an object in S3
        const putObjectCommand = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
            ContentType: contentType,
        });

        // Generate pre-signed URL (valid for 60 seconds)
        const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
            expiresIn: 60
        });

        console.log('Pre-signed URL generated successfully');

        // Return the URL and the key
        return NextResponse.json({
            uploadUrl,
            fileKey,
            bucketName: S3_BUCKET_NAME
        });
    } catch (error: any) {
        console.error('Error generating upload URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL', details: error.message },
            { status: 500 }
        );
    }
} 