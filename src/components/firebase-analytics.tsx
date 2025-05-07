'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initializeApp, FirebaseOptions, getApps } from 'firebase/app';
import { getAnalytics, logEvent, isSupported, setAnalyticsCollectionEnabled, Analytics } from 'firebase/analytics';

// Get Firebase config from environment variables
const getFirebaseConfig = (): FirebaseOptions | null => {
    const fullConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    if (fullConfig) {
        try {
            console.log("Firebase config found from NEXT_PUBLIC_FIREBASE_CONFIG");
            return JSON.parse(fullConfig);
        } catch (error) {
            console.error('Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG:', error);
        }
    }

    // Fall back to individual environment variables
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.log("Firebase config found from individual env variables");
        return {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
        };
    }

    // No fallback - if environment variables aren't found, return null
    console.warn('Firebase configuration missing. Analytics will be disabled.');
    return null;
};

// Helper to get page name from path
const getPageNameFromPath = (path: string): string => {
    // Remove leading slash and query parameters
    const cleanPath = path.split('?')[0].replace(/^\/+/, '');

    if (cleanPath === '') return 'Home';

    // Handle special routes
    if (cleanPath === 'translator') return 'Translator';
    if (cleanPath === 'stonks') return 'Stock Dashboard';

    // Convert path to title case for other routes
    return cleanPath.split('/').map(segment =>
        segment.charAt(0).toUpperCase() + segment.slice(1)
    ).join(' - ');
};

// We only want to initialize Firebase once
let analyticsInstance: Analytics | null = null;

export function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);

    // Initialize Firebase only once
    useEffect(() => {
        if (typeof window === 'undefined') {
            console.log("Firebase initialization skipped - server-side rendering");
            return;
        }

        const initializeAnalytics = async () => {
            try {
                // Skip initialization if we've already done it
                if (analyticsInstance) {
                    console.log("Firebase Analytics already initialized");
                    setInitialized(true);
                    return;
                }

                // Check if analytics is supported
                const supported = await isSupported();
                if (!supported) {
                    console.log("Firebase Analytics not supported in this environment");
                    return;
                }

                console.log("Firebase Analytics is supported");

                const firebaseConfig = getFirebaseConfig();
                if (!firebaseConfig) {
                    console.log("No Firebase config available, analytics disabled");
                    return;
                }

                // Initialize Firebase if not already initialized
                let app;
                if (getApps().length === 0) {
                    console.log("Initializing new Firebase app");
                    app = initializeApp(firebaseConfig);
                } else {
                    console.log("Using existing Firebase app");
                    app = getApps()[0];
                }

                // Create analytics instance
                analyticsInstance = getAnalytics(app);
                setAnalyticsCollectionEnabled(analyticsInstance, true);

                console.log('Firebase Analytics initialized successfully');
                setInitialized(true);
            } catch (error) {
                console.error('Error initializing Firebase Analytics:', error);
            }
        };

        initializeAnalytics();
    }, []);

    // Track page views when the pathname changes
    useEffect(() => {
        if (!initialized || !pathname || typeof window === 'undefined' || !analyticsInstance) {
            return;
        }

        try {
            // Combine pathname and search params
            const fullPath = searchParams?.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname;

            // Get a descriptive page name based on the current path
            const pageName = getPageNameFromPath(pathname);

            // Log the page view with all necessary information
            logEvent(analyticsInstance, 'page_view', {
                page_path: fullPath,
                page_location: window.location.href,
                page_title: pageName,
                screen_name: pageName
            });

            // Also send a separate screen_view event for better reporting
            logEvent(analyticsInstance, 'screen_view', {
                firebase_screen: pageName,
                firebase_screen_class: pageName
            });

            if (process.env.NODE_ENV !== 'production') {
                console.log(`Analytics: tracked "${pageName}" page view`);
            }
        } catch (error) {
            console.error('Error logging page view:', error);
        }
    }, [pathname, searchParams, initialized]);

    return null;
} 