"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Header() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        // Skip effect if not on homepage
        if (pathname !== "/") return;

        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    // Early return after all hooks have been called
    if (pathname !== "/") return null;

    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    const fadeThreshold = viewportHeight * 0.2;
    const opacity = scrollPosition < fadeThreshold
        ? 1
        : Math.max(0, 1 - (scrollPosition - fadeThreshold) / 100);

    if (opacity <= 0) return null;

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-transparent"
            style={{ opacity }}
        >
            <div className="w-[90%] mx-auto py-4">
                <div className="flex justify-end">
                    <Link
                        href="/resume"
                        className="px-5 py-3 rounded-md text-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                    >
                        Resume
                    </Link>
                </div>
            </div>
        </header>
    );
} 