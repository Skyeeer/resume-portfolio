import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

// Define environment variable names for clarity
const REGION = process.env.REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Helper function to convert S3 stream to File object
async function streamToFile(stream: Readable, filename: string, contentType: string): Promise<File> {
    // Convert the stream to a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Convert buffer to a File object
    return new File([buffer], filename, { type: contentType });
}

export async function POST(request: Request) {
    try {
        // Check if the API key is set
        if (!process.env.OPENAI_API_KEY) {
            console.error("Missing OpenAI API key");
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Check S3 configuration
        if (!S3_BUCKET_NAME) {
            console.error("Missing S3_BUCKET_NAME environment variable");
            return NextResponse.json(
                { error: 'S3 bucket name not configured' },
                { status: 500 }
            );
        }

        // Get file information from request
        const { fileKey } = await request.json();

        if (!fileKey) {
            return NextResponse.json(
                { error: 'No file key provided' },
                { status: 400 }
            );
        }

        console.log(`Retrieving file from S3: ${fileKey}`);

        // Initialize clients
        const s3Client = new S3Client({ region: REGION });
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        try {
            // Get the file from S3
            const getObjectCommand = new GetObjectCommand({
                Bucket: S3_BUCKET_NAME,
                Key: fileKey,
            });

            const response = await s3Client.send(getObjectCommand);

            if (!response.Body) {
                throw new Error('Empty response body from S3');
            }

            console.log('Successfully retrieved file from S3');

            // Convert the S3 object stream to a File
            const stream = response.Body as Readable;
            const contentType = response.ContentType || 'audio/webm';
            const file = await streamToFile(stream, fileKey.split('/').pop() || 'audio.webm', contentType);

            console.log(`Prepared file for transcription: ${file.name}, size: ${file.size} bytes`);

            // Transcribe the audio using OpenAI Whisper
            console.log('Sending to OpenAI Whisper API...');
            const transcription = await openai.audio.transcriptions.create({
                file: file,
                model: 'whisper-1',
                language: 'en',
                temperature: 0.2,
            });

            console.log('Transcription received:', transcription.text);

            // Return the transcribed text
            return NextResponse.json({ text: transcription.text });
        } catch (apiError: any) {
            console.error('API error:', apiError);
            return NextResponse.json(
                { error: 'Failed to process file', details: apiError.message },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in transcription API:', error);
        return NextResponse.json(
            { error: 'Failed to transcribe audio', details: error.message },
            { status: 500 }
        );
    }
} 