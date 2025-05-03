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

        // Initialize OpenAI with API key inside the function
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Get the JSON data with base64 audio
        const { audio, mimeType } = await request.json() as TranscriptionRequest;

        if (!audio) {
            return NextResponse.json(
                { error: 'No audio provided' },
                { status: 400 }
            );
        }

        console.log(`Received base64 audio data, mime type: ${mimeType}`);

        try {
            // Create a temporary file to store the audio
            // This is necessary because OpenAI's API requires a file or file path
            const tempDir = os.tmpdir();
            const fileExt = mimeType.split('/')[1] || 'webm';
            const tempFilePath = path.join(tempDir, `audio-${Date.now()}.${fileExt}`);

            // Decode base64 data and write to file
            const buffer = Buffer.from(audio, 'base64');
            fs.writeFileSync(tempFilePath, buffer);

            console.log(`Temporary file created at: ${tempFilePath}`);
            console.log("Sending audio to OpenAI Whisper API...");

            // Use a file stream for the API request
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: 'whisper-1',
                language: 'en',
                temperature: 0.2,
            });

            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);

            console.log("Transcription received:", transcription.text);

            // Return the transcribed text
            return NextResponse.json({ text: transcription.text });

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