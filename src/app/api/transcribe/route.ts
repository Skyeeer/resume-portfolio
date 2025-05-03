import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

        // Convert the file to a buffer
        const buffer = Buffer.from(await audioFile.arrayBuffer());

        try {
            // Use OpenAI's Whisper API for transcription
            console.log("Sending audio to OpenAI Whisper API...");

            try {
                // Method 1: Using File API (works in standard environments)
                const audioBlob = new Blob([buffer], { type: audioFile.type });
                const fileToUpload = new File([audioBlob], audioFile.name, { type: audioFile.type });

                const transcription = await openai.audio.transcriptions.create({
                    file: fileToUpload,
                    model: 'whisper-1',
                    language: 'en', // Optional: force English recognition
                    prompt: "The audio may start mid-sentence. Complete sentences are preferred.", // Help with partial sentences
                    temperature: 0.2, // Lower temperature for more accurate transcription
                });

                console.log("Transcription received:", transcription.text);

                // Return the transcribed text
                return NextResponse.json({ text: transcription.text });
            } catch (error: any) {
                console.error("File API method failed, trying alternative method:", error.message);

                // Method 2: Alternative approach for serverless environments
                // Use the Node.js File System instead of the browser File API
                const fs = require('fs');
                const os = require('os');
                const path = require('path');

                // Create a temporary file
                const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.${audioFile.type.split('/')[1] || 'webm'}`);
                fs.writeFileSync(tempFilePath, buffer);

                // Use the file path for transcription
                const transcription = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(tempFilePath),
                    model: 'whisper-1',
                    language: 'en',
                    prompt: "The audio may start mid-sentence. Complete sentences are preferred.",
                    temperature: 0.2,
                });

                // Clean up temporary file
                fs.unlinkSync(tempFilePath);

                console.log("Transcription received (alternative method):", transcription.text);

                // Return the transcribed text
                return NextResponse.json({ text: transcription.text });
            }
        } catch (openaiError: any) {
            console.error("OpenAI Whisper API error:", JSON.stringify({ message: openaiError.message, status: openaiError.status, type: openaiError.type, code: openaiError.code, param: openaiError.param }, null, 2));
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