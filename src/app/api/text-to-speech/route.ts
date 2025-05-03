import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface TTSRequest {
    text: string;
    voice?: string;
}

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

        // Parse the incoming request
        const { text, voice = 'alloy' } = await request.json() as TTSRequest;

        if (!text) {
            return NextResponse.json(
                { error: 'No text provided for text-to-speech' },
                { status: 400 }
            );
        }

        console.log("TTS request for:", { text: text.substring(0, 50) + (text.length > 50 ? '...' : ''), voice });

        // Use OpenAI's TTS API
        try {
            const audioResponse = await openai.audio.speech.create({
                model: 'tts-1',
                voice,
                input: text,
            });

            console.log("TTS response received, converting to buffer");

            // Get audio data as ArrayBuffer
            const audioBuffer = await audioResponse.arrayBuffer();
            const buffer = Buffer.from(audioBuffer);

            console.log("Returning audio buffer of size:", buffer.length);

            // Return audio as binary stream
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': buffer.length.toString(),
                },
            });
        } catch (openaiError: any) {
            console.error("OpenAI TTS API error:", openaiError);
            return NextResponse.json(
                {
                    error: 'OpenAI TTS API error',
                    details: openaiError.message || 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in text-to-speech API:', error);
        return NextResponse.json(
            {
                error: 'Failed to convert text to speech',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
} 