import { NextResponse } from 'next/server';
import { TranslationServiceClient } from '@google-cloud/translate';

interface TranslateRequest {
    text: string;
    targetLanguage?: string;
}

export async function POST(req: Request) {
    try {
        // Parse the incoming request
        const body = await req.json();
        const { text, targetLanguage = 'es' } = body as TranslateRequest;

        console.log("TRANSLATE API RECEIVED REQUEST:", {
            text: text?.substring(0, 30),
            targetLanguage,
            rawBody: JSON.stringify(body).substring(0, 100)
        });

        if (!text) {
            return NextResponse.json(
                { error: 'No text provided for translation' },
                { status: 400 }
            );
        }

        console.log("API: Will translate to language:", targetLanguage);

        // Check if Google credentials are configured
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_JSON) {
            console.error("Missing Google credentials");
            return NextResponse.json(
                { error: 'Google Cloud credentials not configured' },
                { status: 500 }
            );
        }

        // Initialize the Google Translation client
        let translationClient;

        try {
            if (process.env.GOOGLE_APPLICATION_JSON) {
                // When using JSON credentials directly
                const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_JSON);
                translationClient = new TranslationServiceClient({
                    credentials,
                });
            } else {
                // When using credentials file
                translationClient = new TranslationServiceClient();
            }
        } catch (initError: any) {
            console.error("Error initializing translation client:", initError);
            return NextResponse.json(
                { error: 'Failed to initialize translation client' },
                { status: 500 }
            );
        }

        // Configure the request
        const projectId = process.env.GOOGLE_PROJECT_ID;

        if (!projectId) {
            console.error("Missing GOOGLE_PROJECT_ID");
            return NextResponse.json(
                { error: 'Google Cloud project ID not configured' },
                { status: 500 }
            );
        }

        const location = 'global';

        try {
            // Translate the text
            const translateParams = {
                parent: `projects/${projectId}/locations/${location}`,
                contents: [text],
                mimeType: 'text/plain',
                targetLanguageCode: targetLanguage,
            };

            console.log("API: FINAL TRANSLATION PARAMS:", JSON.stringify(translateParams));

            // Call Google Translate API
            const [response] = await translationClient.translateText(translateParams);

            if (!response || !response.translations || response.translations.length === 0) {
                console.error("Empty translation response");
                return NextResponse.json(
                    { error: 'Translation API returned an empty response' },
                    { status: 500 }
                );
            }

            // Extract translated text with proper error handling
            const translatedText = response.translations[0]?.translatedText || '';

            if (!translatedText) {
                console.error("Empty translation result");
                return NextResponse.json(
                    { error: 'Translation returned empty result' },
                    { status: 500 }
                );
            }

            // Get detected language from the response if available
            const detectedLanguage = response.translations[0]?.detectedLanguageCode || 'unknown';

            console.log(`API: TRANSLATION COMPLETE: ${detectedLanguage} -> ${targetLanguage}`);
            console.log(`API: Result: "${translatedText}"`);

            return NextResponse.json({
                translatedText,
                detectedLanguage,
                targetLanguage // Include the target language in the response for debugging
            });

        } catch (translateError: any) {
            console.error("Error during translation:", translateError);
            return NextResponse.json(
                { error: 'Failed to translate text', details: translateError.message },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in translation API:', error);
        return NextResponse.json(
            { error: 'Failed to translate text', details: error.message },
            { status: 500 }
        );
    }
} 