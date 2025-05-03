import React from "react";

interface Message {
    text: string;
    isTranslated: boolean;
    detectedLanguage?: string;
}

interface TranslationChatProps {
    messages: Message[];
    isProcessing: boolean;
}

export function TranslationChat({ messages, isProcessing }: TranslationChatProps) {
    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto px-2 py-4">
            {messages.length === 0 && !isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p className="text-center bg-secondary/5 p-6 rounded-lg">
                        Speak into your microphone to start translating
                    </p>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg max-w-[85%] shadow-sm ${message.isTranslated
                                ? "bg-accent/20 self-end border border-accent/30"
                                : "bg-secondary/10 self-start border border-secondary/20"
                                }`}
                        >
                            <p className="break-words">{message.text}</p>
                            <div className="mt-1 text-xs text-muted-foreground flex justify-end">
                                {message.isTranslated ? "Translated" : "Original"}
                            </div>
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="bg-secondary/10 p-4 rounded-lg self-start animate-pulse border border-secondary/20 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-100"></div>
                                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-200"></div>
                                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-300"></div>
                                <span className="ml-2">Translating...</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 