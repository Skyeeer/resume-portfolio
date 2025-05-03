"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SpeechToText } from "@/components/translator/speech-to-text";
import { TextToSpeech } from "@/components/translator/text-to-speech";
import { TranslationChat } from "@/components/translator/translation-chat";
import { LanguageSelector } from "@/components/translator/language-selector";

interface Message {
    text: string;
    isTranslated: boolean;
    detectedLanguage?: string;
    targetLanguage?: string;
}

export default function TranslatorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState("de");

    // Load saved state from localStorage on mount
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem("translatorMessages");
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }

            const savedLanguage = localStorage.getItem("translatorLanguage");
            if (savedLanguage) {
                setTargetLanguage(savedLanguage);
            }
        } catch (error) {
            console.error("Error loading saved state:", error);
        }
    }, []);

    // Save state to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem("translatorMessages", JSON.stringify(messages));
        } catch (error) {
            console.error("Error saving messages:", error);
        }
    }, [messages]);

    useEffect(() => {
        try {
            localStorage.setItem("translatorLanguage", targetLanguage);
        } catch (error) {
            console.error("Error saving language:", error);
        }
    }, [targetLanguage]);

    // Process audio recording and initiate translation
    const handleTranscription = async (text: string) => {
        setMessages(prev => [...prev, { text, isTranslated: false }]);
        setIsProcessing(true);
        await translateText(text, targetLanguage);
    };

    // Translate text using the API
    const translateText = async (text: string, language: string) => {
        if (!text) {
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, targetLanguage: language }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to translate text");
            }

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    text: data.translatedText,
                    isTranslated: true,
                    detectedLanguage: data.detectedLanguage || "unknown",
                    targetLanguage: language
                }
            ]);

            await playTranslatedAudio(data.translatedText);

        } catch (error) {
            console.error("Error translating text:", error);
            alert("Translation failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Play translated text as audio
    const playTranslatedAudio = async (text: string) => {
        try {
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
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
            console.error("Auto-play error:", error);
        }
    };

    const handleLanguageChange = (languageCode: string) => {
        setTargetLanguage(languageCode);
    };

    const clearConversation = () => {
        setMessages([]);
        localStorage.removeItem("translatorMessages");
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
            <div className="w-full max-w-3xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Live Translator</h1>
                    <Link href="/" className="text-sm underline">
                        Back to Portfolio
                    </Link>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-medium">Select language to translate to:</h2>
                        <button
                            onClick={clearConversation}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Clear Conversation
                        </button>
                    </div>
                    <LanguageSelector
                        onLanguageChange={handleLanguageChange}
                        defaultLanguage="de"
                        value={targetLanguage}
                    />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex-1 min-h-[50vh]">
                    <TranslationChat
                        messages={messages}
                        isProcessing={isProcessing}
                    />
                </div>

                <div className="flex justify-center gap-4 flex-col items-center">
                    <SpeechToText
                        onTranscriptionComplete={handleTranscription}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                    />

                    {messages.length > 0 && messages[messages.length - 1].isTranslated && (
                        <div className="mt-4">
                            <TextToSpeech text={messages[messages.length - 1].text} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 