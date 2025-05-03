"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaMicrophone, FaStop } from "react-icons/fa";

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
        <div className="flex flex-col gap-4 items-center w-full">
            <div className="relative w-full flex justify-center items-center py-3">
                <div className={`absolute inset-0 transition-opacity duration-700 blur-xl rounded-full ${isRecording ? 'opacity-100' : 'opacity-0'} ${isRecording ? 'bg-secondary/30 animate-pulse' : 'bg-transparent'}`}></div>
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative z-10 w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-all 
                        ${isRecording
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                        } ${(isProcessing && !isRecording) || isPreparing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`
                    }
                    disabled={(isProcessing && !isRecording) || isPreparing}
                >
                    {isRecording ? (
                        <FaStop size={24} />
                    ) : isPreparing ? (
                        <span className="h-6 w-6 animate-spin rounded-full border-3 border-secondary-foreground/30 border-t-secondary-foreground" />
                    ) : (
                        <FaMicrophone size={24} />
                    )}
                </button>
            </div>
            <p className="text-sm font-medium text-center">
                {isRecording
                    ? "Recording... Tap to stop"
                    : isPreparing
                        ? "Preparing microphone..."
                        : isProcessing
                            ? "Processing audio..."
                            : "Tap to start recording"
                }
            </p>
        </div>
    );
} 