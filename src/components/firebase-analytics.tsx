'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initializeApp, FirebaseOptions, getApps } from 'firebase/app';
import { getAnalytics, logEvent, isSupported, setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Get Firebase config from environment variables
const getFirebaseConfig = (): FirebaseOptions | null => {
    const fullConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    if (fullConfig) {
        try {
            return JSON.parse(fullConfig);
        } catch (error) {
            console.error('Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG:', error);
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

    return null;
};

export function FirebaseAnalytics() {
    const pathname = usePathname();
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

    // Initialize Firebase only once
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const initializeAnalytics = async () => {
            try {
                if (await isSupported()) {
                    const firebaseConfig = getFirebaseConfig();
                    if (!firebaseConfig) return;

                    // Avoid initializing Firebase multiple times
                    let app;
                    if (getApps().length === 0) {
                        app = initializeApp(firebaseConfig);
                    } else {
                        app = getApps()[0];
                    }

                    const analytics = getAnalytics(app);
                    setAnalyticsCollectionEnabled(analytics, true);
                    console.log('Firebase Analytics initialized');
                    setAnalyticsInitialized(true);
                }
            } catch (error) {
                console.error('Error initializing Firebase Analytics:', error);
            }
        };

        initializeAnalytics();
    }, []);

    // Track page views when the pathname changes
    useEffect(() => {
        if (!analyticsInitialized || !pathname || typeof window === 'undefined') {
            return;
        }

        try {
            const analytics = getAnalytics();
            logEvent(analytics, 'page_view', {
                page_path: pathname,
                page_location: window.location.href,
                page_title: document.title
            });
        } catch (error) {
            console.error('Error logging page view:', error);
        }
    }, [pathname, analyticsInitialized]);

    return null;
} 