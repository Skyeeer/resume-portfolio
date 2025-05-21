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

const getPageNameFromPath = (path: string): string => {
    const cleanPath = path.split('?')[0].replace(/^\/+/, '');

    if (cleanPath === '') return 'Home';

    // Handle special routes
    if (cleanPath === 'translator') return 'Translator';
    if (cleanPath === 'stonks') return 'Stock Dashboard';

    return cleanPath.split('/').map(segment =>
        segment.charAt(0).toUpperCase() + segment.slice(1)
    ).join(' - ');
};

let analyticsInstance: Analytics | null = null;

export function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);


    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const initializeAnalytics = async () => {
            try {
                if (analyticsInstance) {
                    setInitialized(true);
                    return;
                }

                const supported = await isSupported();
                if (!supported) {
                    return;
                }

                const firebaseConfig = getFirebaseConfig();
                if (!firebaseConfig) {
                    return;
                }

                let app;
                if (getApps().length === 0) {
                    app = initializeApp(firebaseConfig);
                } else {
                    app = getApps()[0];
                }

                analyticsInstance = getAnalytics(app);
                setAnalyticsCollectionEnabled(analyticsInstance, true);

                setInitialized(true);
            } catch (error) {
                // Silent error handling
            }
        };

        initializeAnalytics();
    }, []);

    useEffect(() => {
        if (!initialized || !pathname || typeof window === 'undefined' || !analyticsInstance) {
            return;
        }

        try {
            const fullPath = searchParams?.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname;

            const pageName = getPageNameFromPath(pathname);

            logEvent(analyticsInstance, 'page_view', {
                page_path: fullPath,
                page_location: window.location.href,
                page_title: pageName,
                screen_name: pageName
            });

            logEvent(analyticsInstance, 'screen_view', {
                firebase_screen: pageName,
                firebase_screen_class: pageName
            });
        } catch (error) {
            // Silent error handling
        }
    }, [pathname, searchParams, initialized]);

    return null;
} 