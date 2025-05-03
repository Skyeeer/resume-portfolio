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
        <div className="flex flex-col gap-4 h-full">
            {messages.length === 0 && !isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Record audio to see translations</p>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg max-w-[80%] ${message.isTranslated
                                ? "bg-blue-100 dark:bg-blue-900 self-end"
                                : "bg-gray-100 dark:bg-gray-800 self-start"
                                }`}
                        >
                            <p>{message.text}</p>
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg self-start animate-pulse">
                            Processing...
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 