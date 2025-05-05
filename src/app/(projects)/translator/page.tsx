"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SpeechToText } from "./components/speech-to-text";
import { TextToSpeech } from "./components/text-to-speech";
import { TranslationChat } from "./components/translation-chat";
import { LanguageSelector } from "./components/language-selector";
import { FaArrowLeft } from "react-icons/fa";

// Types to track loading state more precisely
type LoadingState = {
    translation: boolean;
    textToSpeech: boolean;
    transcription: boolean;
};

interface Message {
    text: string;
    isTranslated: boolean;
    detectedLanguage?: string;
    targetLanguage?: string;
}

// Simple cache for translations
type TranslationCache = {
    [key: string]: { // key is sourceText_targetLang
        translatedText: string;
        detectedLanguage: string;
        timestamp: number;
    }
};

// Cache expiration time (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

export default function TranslatorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState("de");
    const [loadingState, setLoadingState] = useState<LoadingState>({
        translation: false,
        textToSpeech: false,
        transcription: false
    });
    const [translationCache, setTranslationCache] = useState<TranslationCache>({});

    // Load saved state from localStorage on mount
    useEffect(() => {
        try {
            // Load messages
            const savedMessages = localStorage.getItem("translatorMessages");
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }

            // Load language preference
            const savedLanguage = localStorage.getItem("translatorLanguage");
            if (savedLanguage) {
                setTargetLanguage(savedLanguage);
            }

            // Load translation cache
            const savedCache = localStorage.getItem("translatorCache");
            if (savedCache) {
                const parsedCache = JSON.parse(savedCache) as TranslationCache;
                // Clear expired cache entries
                const now = Date.now();
                const cleanedCache = Object.fromEntries(
                    Object.entries(parsedCache).filter(
                        ([_, value]) => now - value.timestamp < CACHE_TTL
                    )
                );
                setTranslationCache(cleanedCache);
            }
        } catch (error) {
            console.error("Error loading saved state:", error);
        }
    }, []);

    // Save messages to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem("translatorMessages", JSON.stringify(messages));
        } catch (error) {
            console.error("Error saving messages:", error);
        }
    }, [messages]);

    // Save language preference to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem("translatorLanguage", targetLanguage);
        } catch (error) {
            console.error("Error saving language:", error);
        }
    }, [targetLanguage]);

    // Save translation cache to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem("translatorCache", JSON.stringify(translationCache));
        } catch (error) {
            console.error("Error saving translation cache:", error);
        }
    }, [translationCache]);

    // Process audio recording and initiate translation
    const handleTranscription = async (text: string, detectedLanguage?: string) => {
        if (!text) return;

        setMessages(prev => [...prev, {
            text,
            isTranslated: false,
            detectedLanguage: detectedLanguage || 'unknown'
        }]);
        setIsProcessing(true);
        await translateText(text, targetLanguage);
    };

    // Check cache for existing translation
    const getCachedTranslation = (text: string, language: string) => {
        const cacheKey = `${text}_${language}`;
        const cachedResult = translationCache[cacheKey];

        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            console.log("Using cached translation");
            return cachedResult;
        }

        return null;
    };

    // Store translation in cache
    const cacheTranslation = (text: string, language: string, translatedText: string, detectedLanguage: string) => {
        const cacheKey = `${text}_${language}`;

        setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: {
                translatedText,
                detectedLanguage,
                timestamp: Date.now()
            }
        }));
    };

    // Translate text using the API, with caching and parallel audio generation
    const translateText = async (text: string, language: string) => {
        if (!text) {
            setIsProcessing(false);
            return;
        }

        // Update loading state
        setLoadingState(prev => ({
            ...prev,
            translation: true
        }));

        try {
            // Check cache first
            const cachedTranslation = getCachedTranslation(text, language);
            if (cachedTranslation) {
                // Use cached result
                const translatedText = cachedTranslation.translatedText;
                const detectedLanguage = cachedTranslation.detectedLanguage;

                setMessages(prev => [
                    ...prev,
                    {
                        text: translatedText,
                        isTranslated: true,
                        detectedLanguage: detectedLanguage,
                        targetLanguage: language
                    }
                ]);

                // Start text-to-speech in parallel
                playTranslatedAudio(translatedText).catch(error => {
                    console.error("Error with audio playback (cached result):", error);
                });

                return;
            }

            // Make API request with faster quality setting
            const response = await fetch("/translator/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    targetLanguage: language,
                    fastMode: true // Add hint for faster, lower quality if needed
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to translate text");
            }

            const data = await response.json();
            const translatedText = data.translatedText;
            const detectedLanguage = data.detectedLanguage || "unknown";

            // Update messages with translation result
            setMessages(prev => [
                ...prev,
                {
                    text: translatedText,
                    isTranslated: true,
                    detectedLanguage: detectedLanguage,
                    targetLanguage: language
                }
            ]);

            // Cache the translation
            cacheTranslation(text, language, translatedText, detectedLanguage);

            // Start text-to-speech in parallel
            playTranslatedAudio(translatedText).catch(error => {
                console.error("Error with audio playback:", error);
            });

        } catch (error) {
            console.error("Error translating text:", error);
            alert("Translation failed. Please try again.");
        } finally {
            setLoadingState(prev => ({
                ...prev,
                translation: false
            }));
            setIsProcessing(false);
        }
    };

    // Play translated text as audio
    const playTranslatedAudio = async (text: string) => {
        if (!text) return;

        setLoadingState(prev => ({
            ...prev,
            textToSpeech: true
        }));

        try {
            const response = await fetch("/translator/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    quality: "medium" // Lower quality for faster generation
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get audio");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play().catch(err => {
                console.error("Failed to auto-play audio:", err);
            });
        } catch (error) {
            console.error("Audio playback error:", error);
        } finally {
            setLoadingState(prev => ({
                ...prev,
                textToSpeech: false
            }));
        }
    };

    const handleLanguageChange = (languageCode: string) => {
        setTargetLanguage(languageCode);
    };

    const clearConversation = () => {
        setMessages([]);
        localStorage.removeItem("translatorMessages");
    };

    // Calculate loading message
    const getLoadingMessage = () => {
        if (loadingState.transcription) return "Converting speech to text...";
        if (loadingState.translation) return "Translating...";
        if (loadingState.textToSpeech) return "Generating audio...";
        if (isProcessing) return "Processing...";
        return "";
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-secondary/5 via-background to-accent/5">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="flex flex-col gap-8">
                    {/* Header with navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors"
                            >
                                <FaArrowLeft size={16} />
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                AI Translator
                            </h1>
                        </div>

                        <button
                            onClick={clearConversation}
                            className="px-3 py-1.5 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            Clear Conversation
                        </button>
                    </div>

                    {/* Language selector */}
                    <div className="bg-card shadow-md rounded-xl p-5 border border-secondary/10">
                        <h2 className="text-lg font-medium mb-3 text-secondary">Select target language:</h2>
                        <LanguageSelector
                            onLanguageChange={handleLanguageChange}
                            defaultLanguage="de"
                            value={targetLanguage}
                        />
                    </div>

                    {/* Loading indicator */}
                    {(loadingState.translation || loadingState.textToSpeech || loadingState.transcription || isProcessing) && (
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-md flex items-center gap-2 animate-pulse">
                            <div className="h-3 w-3 rounded-full bg-primary animate-bounce"></div>
                            <p className="text-sm font-medium">{getLoadingMessage()}</p>
                        </div>
                    )}

                    {/* Chat container */}
                    <div className="bg-card rounded-xl shadow-lg border border-accent/10 p-5 h-[50vh] overflow-hidden flex flex-col">
                        <TranslationChat
                            messages={messages}
                            isProcessing={isProcessing}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-4 bg-card rounded-xl p-5 shadow-md border border-secondary/10">
                        <SpeechToText
                            onTranscriptionComplete={handleTranscription}
                            isProcessing={isProcessing}
                            setIsProcessing={setIsProcessing}
                            onTranscriptionStateChange={(isTranscribing) =>
                                setLoadingState(prev => ({ ...prev, transcription: isTranscribing }))
                            }
                        />

                        {messages.length > 0 && messages[messages.length - 1].isTranslated && (
                            <div className="mt-2 w-full max-w-md">
                                <TextToSpeech
                                    text={messages[messages.length - 1].text}
                                    quality="medium"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
} 