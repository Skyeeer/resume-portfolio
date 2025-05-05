"use client";

import { useState, useRef } from "react";
import { FaPlay, FaStop, FaVolumeUp } from "react-icons/fa";

interface TextToSpeechProps {
    text: string;
    voice?: string;
    quality?: 'high' | 'medium' | 'low';
}

export function TextToSpeech({ text, voice = 'alloy', quality = 'high' }: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = async () => {
        if (!text || isPlaying) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log("Requesting text-to-speech for:", { text, voice, quality });

            const response = await fetch("/projects/translator/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, voice, quality }),
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

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex items-center justify-between gap-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <FaVolumeUp className="text-accent" size={18} />
                    </div>
                    <div className="text-sm">
                        <div>Listen to the translation</div>
                        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                    </div>
                </div>

                <button
                    onClick={isPlaying ? stopAudio : playAudio}
                    disabled={!text || isLoading}
                    className={`rounded-full px-4 py-2 flex items-center gap-2 transition-colors
                        ${isPlaying
                            ? 'bg-destructive/90 text-destructive-foreground hover:bg-destructive'
                            : 'bg-accent text-accent-foreground hover:bg-accent/90'
                        } ${!text || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isPlaying ? (
                        <>
                            <FaStop size={14} />
                            <span>Stop</span>
                        </>
                    ) : (
                        <>
                            <FaPlay size={14} />
                            <span>Play</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
} 