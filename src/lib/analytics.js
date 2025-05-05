import awsconfig from '../aws-exports';

// Only import and initialize Amplify on the client side
let Analytics = null;
let Amplify = null;

// Check if we're running on the browser
if (typeof window !== 'undefined') {
    // Dynamically import Amplify and Analytics on client side only
    const amplifyImport = require('aws-amplify');
    Amplify = amplifyImport.Amplify;
    Analytics = amplifyImport.Analytics;

    // Initialize Amplify
    Amplify.configure(awsconfig);

    // Configure Analytics category
    Analytics.configure({
        // OPTIONAL - disable Analytics if true
        disabled: false,
        // OPTIONAL - Allow recording session events. Default is true.
        autoSessionRecord: true,
    });
}

// Function to record page views
export const recordPageView = (pageName) => {
    if (!Analytics) return;

    Analytics.record({
        name: 'pageView',
        attributes: { pageName }
    });
};

// Function to track clicks on project cards
export const recordProjectClick = (projectName) => {
    if (!Analytics) return;

    Analytics.record({
        name: 'projectClick',
        attributes: { projectName }
    });
};

// Function to track section views
export const recordSectionView = (sectionName) => {
    if (!Analytics) return;

    Analytics.record({
        name: 'sectionView',
        attributes: { sectionName }
    });
};

// Function to manually record a custom event
export const recordCustomEvent = (eventName, attributes) => {
    if (!Analytics) return;

    Analytics.record({
        name: eventName,
        attributes
    });
};

// Function to flush events immediately
export const flushEvents = () => {
    if (!Analytics) return;

    Analytics.flush();
}; 