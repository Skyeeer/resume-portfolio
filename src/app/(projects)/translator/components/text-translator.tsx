"use client";

import { useState, useEffect, useRef } from "react";

interface TextTranslatorProps {
    text: string;
    onTranslationComplete: (translatedText: string, detectedLanguage: string) => void;
    targetLanguage: string;
}

export function TextTranslator({
    text,
    onTranslationComplete,
    targetLanguage
}: TextTranslatorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasTranslated, setHasTranslated] = useState(false);

    // Translate the text once when component mounts
    useEffect(() => {
        // Only translate if we haven't already and have text
        if (!hasTranslated && text) {
            translateText();
        }
    }, []);

    const translateText = async () => {
        if (!text || hasTranslated) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log(`Translating text to ${targetLanguage}:`, text.substring(0, 30));

            const response = await fetch("/translator/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    targetLanguage
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to translate text");
            }

            const data = await response.json();
            console.log(`Translation complete (${targetLanguage}):`, data);

            if (data.targetLanguage !== targetLanguage) {
                console.error(`Translation API used wrong language: expected ${targetLanguage} but got ${data.targetLanguage}`);
            }

            // Mark as translated to prevent duplicate calls
            setHasTranslated(true);

            onTranslationComplete(
                data.translatedText,
                data.detectedLanguage || "unknown"
            );
        } catch (error) {
            console.error("Error translating text:", error);
            setError(error instanceof Error ? error.message : "Failed to translate text");
            // Mark as translated even on error to prevent retries
            setHasTranslated(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-2">
            {isLoading && <p className="text-sm text-gray-500">Translating to {targetLanguage}...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
} 