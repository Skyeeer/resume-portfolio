"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SpeechToTextProps {
    onTranscriptionComplete: (text: string) => void;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
}

export function SpeechToText({
    onTranscriptionComplete,
    isProcessing,
    setIsProcessing
}: SpeechToTextProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // File size limit in bytes (3MB as a safe limit for base64 encoding)
    const MAX_AUDIO_SIZE_BYTES = 3 * 1024 * 1024;

    const startRecording = async () => {
        audioChunksRef.current = [];

        try {
            // Set preparing state to show we're getting ready
            setIsPreparing(true);

            // Get access to the microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Create a media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await transcribeAudio(audioBlob);

                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            // Store the recorder
            mediaRecorderRef.current = mediaRecorder;

            // Add a slight delay before starting to record
            // This helps catch the beginning of sentences
            setTimeout(() => {
                console.log("Starting recording...");
                mediaRecorder.start();
                setIsRecording(true);
                setIsPreparing(false);
            }, 500);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Error accessing microphone. Please make sure you have granted permission.");
            setIsPreparing(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            console.log("Stopping recording...");
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);

        try {
            console.log("Starting transcription...");

            // Check file size before proceeding
            if (audioBlob.size > MAX_AUDIO_SIZE_BYTES) {
                console.error(`Audio file too large: ${(audioBlob.size / (1024 * 1024)).toFixed(2)}MB exceeds limit of ${(MAX_AUDIO_SIZE_BYTES / (1024 * 1024))}MB`);
                alert(`Audio file is too large (${(audioBlob.size / (1024 * 1024)).toFixed(2)}MB). Please keep recordings under ${(MAX_AUDIO_SIZE_BYTES / (1024 * 1024))}MB or record a shorter message.`);
                setIsProcessing(false);
                return;
            }

            // Create a form data object with the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.webm');

            // Call the direct transcription API
            console.log("Sending audio directly to transcription API...");
            const response = await fetch("/api/transcribe-direct", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Transcription failed:", response.status, errorData);
                throw new Error(`Failed to transcribe audio: ${errorData.details || errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log("Transcription complete:", data.text);
            onTranscriptionComplete(data.text);
        } catch (error) {
            console.error("Error transcribing audio:", error);
            alert(`An error occurred while transcribing your audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                disabled={(isProcessing && !isRecording) || isPreparing}
            >
                {isRecording ? (
                    <span className="w-4 h-4 bg-white rounded-sm"></span>
                ) : isPreparing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
            <p className="text-sm">
                {isRecording ? "Tap to stop" : isPreparing ? "Preparing..." : "Tap to record"}
            </p>
        </div>
    );
} 