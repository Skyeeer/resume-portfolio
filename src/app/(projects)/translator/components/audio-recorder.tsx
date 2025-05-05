"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    setMessages: React.Dispatch<React.SetStateAction<Array<{ text: string; isTranslated: boolean }>>>;
}

export function AudioRecorder({
    isRecording,
    setIsRecording,
    setIsProcessing,
    setMessages,
}: AudioRecorderProps) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await processAudio(audioBlob);

                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Error accessing microphone. Please make sure you have granted permission.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);

        try {
            // Create form data with the audio file
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.wav");

            // First call the transcription API
            const transcriptionResponse = await fetch("/translator/api/transcribe-direct", {
                method: "POST",
                body: formData,
            });

            if (!transcriptionResponse.ok) {
                throw new Error("Failed to transcribe audio");
            }

            const transcriptionData = await transcriptionResponse.json();
            const originalText = transcriptionData.text;

            // Add the original text to messages
            setMessages(prev => [...prev, { text: originalText, isTranslated: false }]);

            // Then call the translation API
            const translationResponse = await fetch("/translator/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: originalText }),
            });

            if (!translationResponse.ok) {
                throw new Error("Failed to translate text");
            }

            const translationData = await translationResponse.json();
            const translatedText = translationData.translatedText;

            // Add the translated text to messages
            setMessages(prev => [...prev, { text: translatedText, isTranslated: true }]);

            // Request text-to-speech for the translated text
            try {
                const ttsResponse = await fetch("/translator/api/text-to-speech", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: translatedText }),
                });

                if (ttsResponse.ok) {
                    // Convert the response to audio blob
                    const audioBlob = await ttsResponse.blob();
                    // Create an audio element and play it
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audio.play();

                    // Clean up the URL object after playing
                    audio.onended = () => {
                        URL.revokeObjectURL(audioUrl);
                    };
                }
            } catch (ttsError) {
                console.error("Error with text-to-speech:", ttsError);
                // Continue execution even if TTS fails
            }
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("An error occurred while processing your audio.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="rounded-full w-16 h-16"
            >
                {isRecording ? (
                    <span className="w-4 h-4 bg-white rounded-sm"></span>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                    </svg>
                )}
            </Button>
            <p className="text-sm">{isRecording ? "Tap to stop" : "Tap to record"}</p>
        </div>
    );
} 