"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SpeechToText } from "@/components/translator/speech-to-text";
import { TextToSpeech } from "@/components/translator/text-to-speech";
import { TranslationChat } from "@/components/translator/translation-chat";
import { LanguageSelector } from "@/components/translator/language-selector";
import { FaArrowLeft } from "react-icons/fa";

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
                        />

                        {messages.length > 0 && messages[messages.length - 1].isTranslated && (
                            <div className="mt-2 w-full max-w-md">
                                <TextToSpeech text={messages[messages.length - 1].text} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
} 