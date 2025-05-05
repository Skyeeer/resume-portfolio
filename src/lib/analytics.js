'use client';

// No-op implementation for analytics functions
const noop = () => { };

// Default export with no-op functions
const analytics = {
    recordPageView: noop,
    recordProjectClick: noop,
    recordSectionView: noop,
    recordCustomEvent: noop,
    flushEvents: noop,
    isInitialized: false
};

// Initialize analytics only on the client side
if (typeof window !== 'undefined') {
    // Wait for the page to be fully loaded before initializing
    window.addEventListener('load', async () => {
        try {
            // Safely check for environment variables
            const hasConfig =
                typeof process !== 'undefined' &&
                process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID &&
                process.env.NEXT_PUBLIC_PINPOINT_APP_ID;

            if (!hasConfig) {
                console.warn('Analytics disabled: Missing environment variables');
                return;
            }

            // Dynamically import AWS Amplify using the import() function
            const AWS = await import('aws-amplify');

            // Create configuration with environment variables
            const config = {
                Auth: {
                    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
                    region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1'
                },
                Analytics: {
                    disabled: false,
                    autoSessionRecord: true,
                    AWSPinpoint: {
                        appId: process.env.NEXT_PUBLIC_PINPOINT_APP_ID,
                        region: process.env.NEXT_PUBLIC_PINPOINT_REGION || 'eu-central-1'
                    }
                }
            };

            // Configure Amplify
            AWS.Amplify.configure(config);

            // Override the no-op functions with real implementations
            analytics.recordPageView = (pageName) => {
                try {
                    AWS.Analytics.record({
                        name: 'pageView',
                        attributes: { pageName }
                    });
                } catch (e) {
                    console.warn('Failed to record page view:', e);
                }
            };

            analytics.recordProjectClick = (projectName) => {
                try {
                    AWS.Analytics.record({
                        name: 'projectClick',
                        attributes: { projectName }
                    });
                } catch (e) {
                    console.warn('Failed to record project click:', e);
                }
            };

            analytics.recordSectionView = (sectionName) => {
                try {
                    AWS.Analytics.record({
                        name: 'sectionView',
                        attributes: { sectionName }
                    });
                } catch (e) {
                    console.warn('Failed to record section view:', e);
                }
            };

            analytics.recordCustomEvent = (eventName, attributes) => {
                try {
                    AWS.Analytics.record({
                        name: eventName,
                        attributes
                    });
                } catch (e) {
                    console.warn('Failed to record custom event:', e);
                }
            };

            analytics.flushEvents = () => {
                try {
                    AWS.Analytics.flush();
                } catch (e) {
                    console.warn('Failed to flush events:', e);
                }
            };

            analytics.isInitialized = true;
            console.log('Analytics initialized successfully');
        } catch (e) {
            console.warn('Failed to initialize analytics:', e);
        }
    });
}

// Export the analytics methods
export const recordPageView = analytics.recordPageView;
export const recordProjectClick = analytics.recordProjectClick;
export const recordSectionView = analytics.recordSectionView;
export const recordCustomEvent = analytics.recordCustomEvent;
export const flushEvents = analytics.flushEvents; 