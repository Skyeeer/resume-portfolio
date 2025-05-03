import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

// Define environment variable names for clarity
const REGION = process.env.REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

// This is a diagnostic endpoint - disable in production
export async function GET() {
    try {
        // Check environment variables
        const envStatus = {
            REGION: !!REGION,
            REGION_VALUE: REGION,
            S3_BUCKET_NAME: !!S3_BUCKET_NAME,
            NODE_ENV: process.env.NODE_ENV || 'unknown'
        };

        console.log("S3 status check - Environment:", envStatus);

        // Initialize S3 client
        const s3Client = new S3Client({
            region: REGION,
        });

        console.log("S3 client initialized, attempting to list buckets");

        try {
            // Simple test - try to list buckets
            const command = new ListBucketsCommand({});
            const response = await s3Client.send(command);

            const buckets = response.Buckets || [];
            const bucketNames = buckets.map(b => b.Name);

            // Check if our configured bucket is in the list
            const configuredBucketExists = S3_BUCKET_NAME ? bucketNames.includes(S3_BUCKET_NAME) : false;

            console.log(`S3 connection successful - Found ${buckets.length} buckets`);

            return NextResponse.json({
                status: "success",
                message: "S3 connection successful",
                environment: envStatus,
                bucketCount: buckets.length,
                configuredBucketExists,
                hasCredentials: true
            });
        } catch (s3Error: any) {
            console.error("S3 client error:", {
                message: s3Error.message,
                name: s3Error.name,
                code: s3Error.code,
                requestId: s3Error.$metadata?.requestId,
                statusCode: s3Error.$metadata?.httpStatusCode
            });

            return NextResponse.json({
                status: "error",
                message: "S3 credentials error",
                error: s3Error.message,
                code: s3Error.code,
                environment: envStatus,
                hasCredentials: false
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error("General error in S3 status check:", error);

        return NextResponse.json({
            status: "error",
            message: "Failed to check S3 status",
            error: error.message
        }, { status: 500 });
    }
} 