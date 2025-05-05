"use client";

import { useState, useEffect, useRef } from "react";

export function AboutMe() {
    const [displayText, setDisplayText] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const fullText = "Hello! I’m Charlie Ålander, a software developer with a passion for building intuitive and functional web applications. Recently, I’ve been building features and tools using React, Node.js, Firebase, AWS and RESTful APIs. I thrive in small teams where we brainstorm ideas and support each other’s growth (I’ve always had a soft spot for front-end magic). Feel free to explore my work on GitHub or connect on LinkedIn!";

    // Reference to store typing interval
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to start or restart typewriter effect
    const startTypewriterEffect = () => {
        // Clear any existing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        // Reset text
        setDisplayText("");

        let currentIndex = 0;
        typingIntervalRef.current = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
            }
        }, 30);
    };

    // Start typewriter effect on initial mount
    useEffect(() => {
        startTypewriterEffect();

        // Cleanup on unmount
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    // Reset and restart typewriter effect when visible
    useEffect(() => {
        if (isVisible) {
            startTypewriterEffect();
        }
    }, [isVisible]);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="container max-w-4xl mx-auto">
            {/* Heading removed as requested */}

            <div className="w-full rounded-xl overflow-hidden shadow-md border border-secondary/20 hover:border-secondary/50 transition-colors">
                {/* Code block header with lighter styling */}
                <div
                    className="bg-card p-3 md:p-4 flex items-center justify-between cursor-pointer border-b border-secondary/20"
                    onClick={toggleVisibility}
                >
                    <div className="text-xs md:text-sm font-light flex items-center gap-2 text-muted-foreground">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/80"></div>
                        <span>about_me.tsx</span>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors">
                        {isVisible ? "Hide code" : "Show code"}
                    </div>
                </div>

                {/* Code block content with improved line length and spacing */}
                {isVisible && (
                    <pre className="bg-card/80 p-3 md:p-6 rounded-b-xl overflow-x-auto">
                        <code
                            className="block font-mono text-xs md:text-sm transition-all duration-300 ease-in-out"
                            style={{
                                lineHeight: "1.8",
                                maxWidth: "100%", // Allow full width on mobile, will be constrained by parent
                            }}
                        >
                            <span className="text-accent font-semibold">const</span> <span className="text-secondary font-semibold">AboutMe</span> <span className="text-primary">=</span> <span className="text-accent font-semibold">()</span> <span className="text-primary">=&gt;</span> <span className="text-accent font-semibold">&#123;</span>
                            <br />
                            <span className="pl-2 md:pl-4 text-muted-foreground">// A few words about myself</span>
                            <br />
                            <span className="pl-2 md:pl-4 text-accent font-semibold">return</span> <span className="text-primary">(</span>
                            <br />
                            <div className="pl-4 md:pl-8 max-w-full md:max-w-[42rem] whitespace-pre-wrap text-foreground leading-relaxed">
                                {displayText}
                                <span className={`inline-block w-1.5 md:w-2 h-3 md:h-4 bg-accent ml-0 -mr-2 ${displayText.length > 0 ? 'animate-blink' : ''}`}></span>
                            </div>
                            <br />
                            <span className="pl-2 md:pl-4 text-primary">);</span>
                            <br />
                            <span className="text-accent font-semibold">&#125;;</span>
                        </code>
                    </pre>
                )}
            </div>
        </div>
    );
}

// Add this style to your globals.css if not already added
// @keyframes blink {
//     0%, 100% { opacity: 1; }
//     50% { opacity: 0; }
// } 