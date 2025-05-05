import { NextResponse } from 'next/server';
import { TranslationServiceClient } from '@google-cloud/translate';

interface TranslateRequest {
    text: string;
    targetLanguage?: string;
    fastMode?: boolean;
}

// Add debug logging when module loads
console.log("Translate module loaded");
console.log("Translation environment variables present:", {
    GOOGLE_APPLICATION_CREDENTIALS: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
    GOOGLE_APPLICATION_JSON: !!process.env.GOOGLE_APPLICATION_JSON,
    GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID
});

export async function POST(req: Request) {
    try {
        // Parse the incoming request
        const body = await req.json();
        const { text, targetLanguage = 'es', fastMode = false } = body as TranslateRequest;

        console.log("TRANSLATE API RECEIVED REQUEST:", {
            text: text?.substring(0, 30),
            targetLanguage,
            fastMode,
            rawBody: JSON.stringify(body).substring(0, 100)
        });

        if (!text) {
            return NextResponse.json(
                { error: 'No text provided for translation' },
                { status: 400 }
            );
        }

        console.log("API: Will translate to language:", targetLanguage, fastMode ? "(fast mode)" : "");

        // Check if Google credentials are configured
        const hasCredentialsFile = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const hasCredentialsJson = !!process.env.GOOGLE_APPLICATION_JSON;

        if (!hasCredentialsFile && !hasCredentialsJson) {
            console.error("Missing Google credentials - neither GOOGLE_APPLICATION_CREDENTIALS nor GOOGLE_APPLICATION_JSON is set");
            return NextResponse.json(
                { error: 'Google Cloud credentials not configured' },
                { status: 500 }
            );
        }

        // Get project ID
        const projectId = process.env.GOOGLE_PROJECT_ID;
        if (!projectId) {
            console.error("Missing GOOGLE_PROJECT_ID environment variable");
            return NextResponse.json(
                { error: 'Google Cloud project ID not configured' },
                { status: 500 }
            );
        }

        // Initialize the Google Translation client
        let translationClient;

        try {
            if (hasCredentialsJson) {
                // When using JSON credentials directly
                console.log("Using JSON credentials");
                try {
                    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_JSON || '');
                    translationClient = new TranslationServiceClient({
                        credentials,
                    });
                    console.log("Successfully created client with JSON credentials");
                } catch (jsonError: any) {
                    console.error("Error parsing GOOGLE_APPLICATION_JSON:", jsonError.message);
                    return NextResponse.json(
                        { error: 'Invalid Google Cloud credentials JSON', details: jsonError.message },
                        { status: 500 }
                    );
                }
            } else {
                // When using credentials file
                console.log("Using credentials file:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
                translationClient = new TranslationServiceClient();
                console.log("Successfully created client with credentials file");
            }
        } catch (initError: any) {
            console.error("Error initializing translation client:", initError);
            return NextResponse.json(
                { error: 'Failed to initialize translation client', details: initError.message },
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
                // Note: We can't specify model directly as it requires full resource name
                // Use other performance optimizations instead
            };

            // If fastMode is requested, we can modify the request to be simpler
            // This might help with performance even without explicit model selection
            if (fastMode) {
                // No specific optimization available through API params,
                // but we keep the flag for future use and for client awareness
                console.log("Fast mode requested - using standard translation");
            }

            console.log("API: FINAL TRANSLATION PARAMS:", JSON.stringify(translateParams));

            // Call Google Translate API
            console.log("Calling Google Translate API...");
            const [response] = await translationClient.translateText(translateParams);
            console.log("Received response from Google Translate API");

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
                targetLanguage, // Include the target language in the response for debugging
                fastMode // Include whether fast mode was used
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