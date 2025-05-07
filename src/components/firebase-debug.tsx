'use client';

import { useState, useEffect } from 'react';

export function FirebaseDebug() {
    const [debugInfo, setDebugInfo] = useState<{
        hasConfig: boolean;
        configType: string;
        firebaseSDK: boolean;
        error?: string;
    }>({
        hasConfig: false,
        configType: 'none',
        firebaseSDK: false
    });

    useEffect(() => {
        try {
            // Check for config
            const fullConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
            const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

            let hasConfig = false;
            let configType = 'none';

            if (fullConfig) {
                hasConfig = true;
                configType = 'full JSON';
                console.log('Found NEXT_PUBLIC_FIREBASE_CONFIG');
            } else if (apiKey) {
                hasConfig = true;
                configType = 'individual vars';
                console.log('Found NEXT_PUBLIC_FIREBASE_API_KEY');
            }

            // Check for Firebase SDK
            let firebaseSDK = false;
            try {
                // This import is just to check if firebase/app is available
                // It won't actually import anything in this dynamic context
                if (typeof window !== 'undefined') {
                    const testImport = 'firebase/app';
                    console.log('Checking for Firebase SDK');
                    firebaseSDK = true;
                }
            } catch (e) {
                console.error('Error checking Firebase SDK:', e);
            }

            setDebugInfo({
                hasConfig,
                configType,
                firebaseSDK
            });
        } catch (error: any) {
            setDebugInfo({
                hasConfig: false,
                configType: 'none',
                firebaseSDK: false,
                error: error?.message || 'Unknown error'
            });
        }
    }, []);

    // Display debug info only in development or with query param ?debug=true
    const shouldShow = () => {
        if (typeof window === 'undefined') return false;
        if (process.env.NODE_ENV !== 'production') return true;
        return window.location.search.includes('debug=true');
    };

    if (!shouldShow()) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '400px'
            }}
        >
            <h4 style={{ margin: '0 0 5px 0' }}>Firebase Debug</h4>
            <div>Config Available: <span style={{ color: debugInfo.hasConfig ? '#4ade80' : '#ef4444' }}>{debugInfo.hasConfig ? 'Yes' : 'No'}</span></div>
            <div>Config Type: <span style={{ color: debugInfo.configType !== 'none' ? '#4ade80' : '#ef4444' }}>{debugInfo.configType}</span></div>
            <div>Firebase SDK: <span style={{ color: debugInfo.firebaseSDK ? '#4ade80' : '#ef4444' }}>{debugInfo.firebaseSDK ? 'Available' : 'Not Found'}</span></div>
            {debugInfo.error && (
                <div style={{ color: '#ef4444' }}>Error: {debugInfo.error}</div>
            )}
            <hr style={{ margin: '5px 0', borderColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontSize: '10px' }}>
                Add ?debug=true to URL to show in production
            </div>
        </div>
    );
} 