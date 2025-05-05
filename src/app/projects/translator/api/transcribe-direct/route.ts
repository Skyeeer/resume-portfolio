import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

        // Initialize OpenAI with API key
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Get the form data with the audio file
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        console.log(`Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

        try {
            // Send directly to OpenAI's Whisper API
            console.log("Sending audio to OpenAI Whisper API...");
            const transcription = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                temperature: 0.2,
                response_format: 'verbose_json',
            });

            // Access language and text from the verbose response
            const detectedLanguage = transcription.language;
            const transcribedText = transcription.text;

            console.log(`Transcription received in ${detectedLanguage} language:`, transcribedText);

            // Return the transcribed text and detected language
            return NextResponse.json({
                text: transcribedText,
                detectedLanguage: detectedLanguage
            });
        } catch (openaiError: any) {
            console.error("OpenAI Whisper API error:", JSON.stringify({
                message: openaiError.message,
                status: openaiError.status,
                type: openaiError.type,
                code: openaiError.code
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