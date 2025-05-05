'use client';

// Empty placeholder functions for when analytics is disabled or not available
const noopAnalytics = {
    recordPageView: () => { },
    recordProjectClick: () => { },
    recordSectionView: () => { },
    recordCustomEvent: () => { },
    flushEvents: () => { }
};

// If we're not in the browser, return no-op functions
if (typeof window === 'undefined') {
    module.exports = noopAnalytics;
} else {
    try {
        // Dynamically import Amplify and Analytics
        const { Amplify, Analytics } = require('aws-amplify');

        // Check if required environment variables are available
        const hasRequiredEnvVars =
            typeof process !== 'undefined' &&
            process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID &&
            process.env.NEXT_PUBLIC_PINPOINT_APP_ID;

        // Only initialize if we have the required configuration
        if (hasRequiredEnvVars) {
            // AWS config
            const awsConfig = {
                aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
                aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
                aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
                aws_mobile_analytics_app_id: process.env.NEXT_PUBLIC_PINPOINT_APP_ID,
                aws_mobile_analytics_app_region: process.env.NEXT_PUBLIC_PINPOINT_REGION || 'eu-central-1'
            };

            // Initialize Amplify
            Amplify.configure(awsConfig);

            // Configure Analytics
            Analytics.configure({
                disabled: false,
                autoSessionRecord: true,
            });

            // Export real analytics functions
            module.exports = {
                recordPageView: (pageName) => {
                    try {
                        Analytics.record({
                            name: 'pageView',
                            attributes: { pageName }
                        });
                    } catch (e) {
                        console.warn('Failed to record page view:', e);
                    }
                },

                recordProjectClick: (projectName) => {
                    try {
                        Analytics.record({
                            name: 'projectClick',
                            attributes: { projectName }
                        });
                    } catch (e) {
                        console.warn('Failed to record project click:', e);
                    }
                },

                recordSectionView: (sectionName) => {
                    try {
                        Analytics.record({
                            name: 'sectionView',
                            attributes: { sectionName }
                        });
                    } catch (e) {
                        console.warn('Failed to record section view:', e);
                    }
                },

                recordCustomEvent: (eventName, attributes) => {
                    try {
                        Analytics.record({
                            name: eventName,
                            attributes
                        });
                    } catch (e) {
                        console.warn('Failed to record custom event:', e);
                    }
                },

                flushEvents: () => {
                    try {
                        Analytics.flush();
                    } catch (e) {
                        console.warn('Failed to flush events:', e);
                    }
                }
            };
        } else {
            console.warn('Analytics disabled: missing required environment variables');
            module.exports = noopAnalytics;
        }
    } catch (e) {
        console.warn('Failed to initialize analytics:', e);
        module.exports = noopAnalytics;
    }
} 