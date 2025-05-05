"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMicrophone, FaLanguage, FaHeadphones, FaChartLine, FaArrowRight } from "react-icons/fa";
import { BsTranslate } from "react-icons/bs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export function FeaturedProjects() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setActiveSlide(api.selectedScrollSnap());
        };

        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className="container max-w-6xl mx-auto">
            <div className="mb-4 text-center">
                <p className="text-center text-muted-foreground mb-6 max-w-xl mx-auto">
                    {/* Dynamic tagline based on the active slide */}
                    {activeSlide === 0 ? (
                        "Language barriers shouldn't limit communication. My AI-powered translator breaks down these barriers in real-time."
                    ) : (
                        "Track Swedish market indices and stocks in an interactive dashboard with custom watchlists and visualizations."
                    )}
                </p>
            </div>

            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {/* Translator Card */}
                    <CarouselItem className="w-full">
                        <div className="bg-card rounded-xl overflow-hidden border border-accent/20">
                            <div className="p-4 md:p-8 bg-secondary/10">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 md:gap-0">
                                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                        AI-Powered Translator
                                    </h3>
                                    <Link
                                        href="/translator"
                                        className="px-4 sm:px-6 py-2 sm:py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-colors shadow-md text-center"
                                    >
                                        Try It Now
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Features */}
                                    <div className="space-y-6 lg:col-span-1">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">Next.js</span>
                                            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">TypeScript</span>
                                            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">OpenAI Whisper</span>

                                        </div>

                                        <p className="text-card-foreground/90">
                                            Bridging language gaps in real-time. This application enables natural conversations
                                            between people who don't share a common language. Speak in your native tongue and
                                            let AI translate and speak your words in the listener's language, perfect for international
                                            communication, travel, and cross-cultural connections.
                                        </p>

                                        <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                                            <h4 className="font-semibold mb-2">Key Features:</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                                                    Real-time speech processing
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                                                    Support for multiple languages
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                                                    Conversation history
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-secondary/20 p-1 rounded-full">✓</span>
                                                    High-quality voice playback
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Visual representation */}
                                    <div className="lg:col-span-2 bg-gradient-to-br from-secondary/10 via-accent/5 to-background rounded-xl p-6 shadow-inner relative overflow-hidden">
                                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
                                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>

                                        <div className="relative z-10">
                                            <h4 className="font-semibold mb-6 text-center">How It Works</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                                <div className="bg-card p-4 rounded-lg shadow-md border border-secondary/20 flex flex-col items-center text-center">
                                                    <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                                                        <FaMicrophone size={24} className="text-secondary" />
                                                    </div>
                                                    <h5 className="font-medium mb-2">Record</h5>
                                                    <p className="text-sm text-muted-foreground">Speak in your native language</p>
                                                </div>

                                                <div className="bg-card p-4 rounded-lg shadow-md border border-accent/20 flex flex-col items-center text-center">
                                                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                                                        <BsTranslate size={24} className="text-accent" />
                                                    </div>
                                                    <h5 className="font-medium mb-2">Translate</h5>
                                                    <p className="text-sm text-muted-foreground">AI processes your speech</p>
                                                </div>

                                                <div className="bg-card p-4 rounded-lg shadow-md border border-primary/20 flex flex-col items-center text-center">
                                                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                                                        <FaHeadphones size={24} className="text-primary" />
                                                    </div>
                                                    <h5 className="font-medium mb-2">Listen</h5>
                                                    <p className="text-sm text-muted-foreground">Hear the translation</p>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex justify-center">
                                                <div className="p-4 bg-card rounded-lg shadow-md border border-secondary/20 max-w-md w-full">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center mr-3">
                                                            <FaLanguage size={16} className="text-secondary" />
                                                        </div>
                                                        <div className="text-sm font-medium">Demo Conversation</div>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="bg-secondary/10 p-2 rounded-lg">
                                                            "Where is the nearest coffee shop?" <span className="text-xs text-muted-foreground">English</span>
                                                        </div>
                                                        <div className="bg-accent/10 p-2 rounded-lg">
                                                            "Var är närmaste kafé?" <span className="text-xs text-muted-foreground">Swedish</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>

                    {/* Stock Dashboard Card */}
                    <CarouselItem className="w-full">
                        <div className="bg-card rounded-xl overflow-hidden border border-accent/20">
                            <div className="p-4 md:p-8 bg-white" style={{ minHeight: "566px" }}>
                                {/* Header with mini chart preview */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3 md:gap-0">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                                            Swedish Stock Dashboard
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">Interactive financial market tracker</p>
                                    </div>
                                    <Link
                                        href="/stonks"
                                        className="px-4 sm:px-6 py-2 sm:py-3 bg-[#0ea5e9] text-white rounded-md font-medium hover:opacity-90 transition-colors text-center"
                                    >
                                        Try It Now
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:h-[450px]">
                                    {/* Left: Mini chart preview */}
                                    <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden h-full min-h-[300px] flex flex-col">
                                        <div className="absolute right-0 top-0 w-full h-1 bg-[#0ea5e9]"></div>

                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <FaChartLine className="text-[#0ea5e9] w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-medium text-slate-800">OMXS30</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md">1D</span>
                                                <span className="px-2 py-1 text-xs bg-[#0ea5e9] text-white rounded-md">1W</span>
                                                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md">1M</span>
                                                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md">3M</span>
                                                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md">1Y</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <div className="text-3xl font-semibold text-slate-800">2,543.16</div>
                                                <div className="flex items-center text-[#4ade80] text-sm">
                                                    <span className="mr-1">▲</span>
                                                    <span>105.09 (4.31%)</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400">Updated: 15:45 CEST</div>
                                        </div>

                                        {/* Mini Chart - taking up rest of the available height */}
                                        <div className="flex-grow mt-2 min-h-[200px]">
                                            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                                                <path
                                                    d="M0,70 C20,65 40,68 60,60 C80,52 100,56 120,50 C140,44 160,40 180,30 C200,20 220,18 240,25 C260,32 280,40 300,35 C320,30 340,25 360,30 C380,35 400,40 400,40"
                                                    fill="none"
                                                    stroke="#4ade80"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d="M0,70 C20,65 40,68 60,60 C80,52 100,56 120,50 C140,44 160,40 180,30 C200,20 220,18 240,25 C260,32 280,40 300,35 C320,30 340,25 360,30 C380,35 400,40 400,40 L400,100 L0,100 Z"
                                                    fill="rgba(74, 222, 128, 0.1)"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Right: Features list */}
                                    <div className="lg:col-span-4 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">Next.js</span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">TypeScript</span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">Tailwind</span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">Yahoo Finance</span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <span className="text-[#0ea5e9] text-xs">✓</span>
                                                    </div>
                                                    <span className="text-sm text-slate-700">Interactive charts with multiple timeframes</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <span className="text-[#0ea5e9] text-xs">✓</span>
                                                    </div>
                                                    <span className="text-sm text-slate-700">Custom stock watchlists with local storage</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <span className="text-[#0ea5e9] text-xs">✓</span>
                                                    </div>
                                                    <span className="text-sm text-slate-700">Swedish market indices & top movers</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <span className="text-[#0ea5e9] text-xs">✓</span>
                                                    </div>
                                                    <span className="text-sm text-slate-700">Responsive design with dark/light mode</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                                <span>Top Movers Today</span>
                                                <span>Change</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-700 font-medium">S</div>
                                                        <span className="text-xs text-slate-700">Sinch</span>
                                                    </div>
                                                    <span className="text-xs text-[#4ade80]">+17.91%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-700 font-medium">E</div>
                                                        <span className="text-xs text-slate-700">Evolution</span>
                                                    </div>
                                                    <span className="text-xs text-[#4ade80]">+7.32%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 mt-4 bg-blue-50 p-3 rounded-lg">
                                            Track the Swedish stock market with OMXS30 and OMXSPI indices. Create custom watchlists,
                                            analyze market trends, and view real-time data with an intuitive interface.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                {/* Visible buttons on mobile for touch indication */}
                <div className="flex justify-center gap-2 mt-4 sm:hidden">
                    <button onClick={() => api?.scrollPrev()} className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-accent/20 text-accent">
                        ←
                    </button>
                    <button onClick={() => api?.scrollNext()} className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-accent/20 text-accent">
                        →
                    </button>
                </div>
                <CarouselPrevious className="absolute -left-4 sm:-left-12 top-1/2 transform -translate-y-1/2 bg-background/80 text-foreground hover:bg-accent/10 border border-accent/20 hidden sm:flex" />
                <CarouselNext className="absolute -right-4 sm:-right-12 top-1/2 transform -translate-y-1/2 bg-background/80 text-foreground hover:bg-accent/10 border border-accent/20 hidden sm:flex" />
            </Carousel>
        </div>
    );
} 
