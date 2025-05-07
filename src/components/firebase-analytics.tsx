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
            return JSON.parse(fullConfig);
        } catch (error) {
            // Silent error in production
            if (process.env.NODE_ENV !== 'production') {
                console.error('Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG:', error);
            }
        }
    }

    // Fall back to individual environment variables
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
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
    if (process.env.NODE_ENV !== 'production') {
        console.warn('Firebase configuration missing. Analytics will be disabled.');
    }
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
            return;
        }

        const initializeAnalytics = async () => {
            try {
                // Skip initialization if we've already done it
                if (analyticsInstance) {
                    setInitialized(true);
                    return;
                }

                // Check if analytics is supported
                if (!(await isSupported())) {
                    return;
                }

                const firebaseConfig = getFirebaseConfig();
                if (!firebaseConfig) {
                    // No config available, don't initialize
                    return;
                }

                // Initialize Firebase if not already initialized
                let app;
                if (getApps().length === 0) {
                    app = initializeApp(firebaseConfig);
                } else {
                    app = getApps()[0];
                }

                // Create analytics instance
                analyticsInstance = getAnalytics(app);
                setAnalyticsCollectionEnabled(analyticsInstance, true);

                // Only log in development
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Firebase Analytics initialized');
                }

                setInitialized(true);
            } catch (error) {
                // Silent error in production
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Error initializing Firebase Analytics:', error);
                }
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

            // Only log in development
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Analytics: tracked "${pageName}" page view`);
            }
        } catch (error) {
            // Silent error in production
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error logging page view:', error);
            }
        }
    }, [pathname, searchParams, initialized]);

    return null;
} 