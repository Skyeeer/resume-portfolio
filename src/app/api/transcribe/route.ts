import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Define the request interface
interface TranscriptionRequest {
    audio: string; // base64-encoded audio 
    mimeType: string;
}

// Function to handle Fetch API's FormData and File/Blob in Node.js environment
function isRunningOnServerless() {
    // Check if running in a Node.js environment (AWS Lambda)
    return typeof window === 'undefined' &&
        process?.versions?.node !== undefined;
}

// Remove the initialization at the module level
// const openai = new OpenAI({
//    apiKey: process.env.OPENAI_API_KEY,
// });

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

        console.log("Transcribe API: Starting process");

        // Initialize OpenAI with API key inside the function
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Get the JSON data with base64 audio
        const body = await request.json();
        const { audio, mimeType } = body as TranscriptionRequest;

        if (!audio) {
            console.error("No audio data provided");
            return NextResponse.json(
                { error: 'No audio provided' },
                { status: 400 }
            );
        }

        console.log(`Received base64 audio data, type: ${mimeType}, length: ${audio.length} chars`);

        try {
            // Generate a unique filename
            const tempDir = os.tmpdir();
            const fileExt = mimeType.split('/')[1] || 'webm';
            const filename = `audio-${Date.now()}.${fileExt}`;
            const tempFilePath = path.join(tempDir, filename);

            // Log the path we're using
            console.log(`Using temporary file path: ${tempFilePath}`);

            try {
                // Attempt file system operations with extensive error handling
                // Decode base64 data and write to file
                const buffer = Buffer.from(audio, 'base64');
                console.log(`Decoded buffer size: ${buffer.length} bytes`);

                fs.writeFileSync(tempFilePath, buffer);
                console.log(`Temporary file created: ${tempFilePath}, size: ${fs.statSync(tempFilePath).size} bytes`);

                // Create a ReadStream for the file
                const fileStream = fs.createReadStream(tempFilePath);

                console.log("Sending audio to OpenAI Whisper API using file method...");

                // Use a file stream for the API request
                const transcription = await openai.audio.transcriptions.create({
                    file: fileStream,
                    model: 'whisper-1',
                    language: 'en',
                    temperature: 0.2,
                });

                // Clean up the temporary file
                try {
                    fs.unlinkSync(tempFilePath);
                    console.log("Removed temporary file");
                } catch (cleanupError) {
                    console.log("Warning: Failed to remove temporary file:", cleanupError);
                    // Continue despite cleanup error
                }

                console.log("Transcription received:", transcription.text);

                // Return the transcribed text
                return NextResponse.json({ text: transcription.text });
            } catch (fsError) {
                // If file system operations fail, try direct buffer method
                console.log("File system operations failed, trying direct buffer method:", fsError);

                // Fallback to using buffer directly with OpenAI
                const buffer = Buffer.from(audio, 'base64');

                // Create a proper File object for OpenAI API
                const file = new File([buffer], filename, { type: mimeType });

                console.log("Sending audio to OpenAI Whisper API using buffer method...");

                const transcription = await openai.audio.transcriptions.create({
                    file: file,
                    model: 'whisper-1',
                    language: 'en',
                    temperature: 0.2,
                });

                console.log("Transcription received (buffer method):", transcription.text);

                // Return the transcribed text
                return NextResponse.json({ text: transcription.text });
            }
        } catch (openaiError: any) {
            console.error("OpenAI Whisper API error:", JSON.stringify({
                message: openaiError.message,
                status: openaiError.status,
                type: openaiError.type,
                code: openaiError.code,
                param: openaiError.param
            }, null, 2));
            return NextResponse.json(
                {
                    error: 'OpenAI Whisper API error',
                    details: openaiError.message || 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in transcription API:', error);
        return NextResponse.json(
            {
                error: 'Failed to transcribe audio',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
} 