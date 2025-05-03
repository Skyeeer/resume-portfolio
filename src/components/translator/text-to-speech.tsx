"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface TextToSpeechProps {
    text: string;
    voice?: string;
}

export function TextToSpeech({ text, voice = 'alloy' }: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = async () => {
        if (!text || isPlaying) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log("Requesting text-to-speech for:", { text, voice });

            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, voice }),
            });

            if (!response.ok) {
                throw new Error("Failed to convert text to speech");
            }

            // Convert the response to audio blob
            const audioBlob = await response.blob();
            console.log("Received audio blob:", audioBlob);

            // Create an audio element and play it
            const audioUrl = URL.createObjectURL(audioBlob);

            // Clean up previous audio element if exists
            if (audioRef.current) {
                audioRef.current.pause();
                URL.revokeObjectURL(audioRef.current.src);
            }

            // Create and configure the audio element
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Set up event handlers
            audio.onplay = () => {
                console.log("Audio playback started");
                setIsPlaying(true);
            };

            audio.onended = () => {
                console.log("Audio playback completed");
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                setIsPlaying(false);
                setError("Failed to play audio");
                URL.revokeObjectURL(audioUrl);
            };

            // Try to play the audio - may need user interaction first
            const playPromise = audio.play();
            if (playPromise) {
                playPromise.catch(err => {
                    console.error("Play promise error:", err);
                    setError("Audio playback blocked. Try clicking the button again.");
                });
            }

        } catch (error) {
            console.error("Error with text-to-speech:", error);
            setError(error instanceof Error ? error.message : "Failed to play audio");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={playAudio}
                disabled={!text || isPlaying || isLoading}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                    >
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .374.016.748.048 1.02.344 1.194 1.516 1.98 2.661 1.98h2.059l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06z" />
                        <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                    </svg>
                )}
                {isPlaying ? "Playing..." : "Listen"}
            </Button>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
} 