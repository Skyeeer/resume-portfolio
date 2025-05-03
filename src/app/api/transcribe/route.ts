import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

        // Get the form data with the audio file
        const formData = await request.formData();
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        console.log(`Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

        try {
            // Convert audio to ArrayBuffer for OpenAI API
            const audioArrayBuffer = await audioFile.arrayBuffer();

            console.log("Sending audio to OpenAI Whisper API...");

            // Try using the original file directly instead of recreating it
            const transcription = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'en',
                temperature: 0.2,
            });

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