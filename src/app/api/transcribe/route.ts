import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
            const transcription = await openai.audio.transcriptions.create({
                file: new File([buffer], audioFile.name, { type: audioFile.type }),
                model: 'whisper-1',
                language: 'en', // Optional: force English recognition
                prompt: "The audio may start mid-sentence. Complete sentences are preferred.", // Help with partial sentences
                temperature: 0.2, // Lower temperature for more accurate transcription
            });

            console.log("Transcription received:", transcription.text);

            // Return the transcribed text
            return NextResponse.json({ text: transcription.text });
        } catch (openaiError: any) {
            console.error("OpenAI Whisper API error:", openaiError);
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