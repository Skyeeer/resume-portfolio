'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

// Get Firebase config from environment variables
const getFirebaseConfig = (): FirebaseOptions | null => {
    // First try to get the full config from a single environment variable
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

    useEffect(() => {
        const initializeAnalytics = async () => {
            try {
                // Get Firebase config
                const firebaseConfig = getFirebaseConfig();

                if (!firebaseConfig) {
                    console.error('Firebase configuration not found in environment variables');
                    return;
                }

                // Check if analytics is supported in the current environment
                if (await isSupported()) {
                    console.log('Firebase Analytics is supported in this environment');

                    // Initialize Firebase
                    const app = initializeApp(firebaseConfig);
                    const analytics = getAnalytics(app);

                    console.log('Firebase Analytics initialized successfully');
                    setAnalyticsInitialized(true);
                } else {
                    console.warn('Firebase Analytics is not supported in this environment');
                }
            } catch (error) {
                console.error('Error initializing Firebase Analytics:', error);
            }
        };

        initializeAnalytics();
    }, []);

    // Track page views when the pathname changes
    useEffect(() => {
        if (analyticsInitialized && pathname) {
            try {
                const analytics = getAnalytics();
                console.log('Logging page_view event for:', pathname);
                logEvent(analytics, 'page_view', {
                    page_path: pathname,
                    page_location: window.location.href,
                    page_title: document.title
                });
            } catch (error) {
                console.error('Error logging page view:', error);
            }
        }
    }, [pathname, analyticsInitialized]);

    // This component doesn't render anything visible
    return null;
} 