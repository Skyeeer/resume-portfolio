import { Amplify, Analytics } from 'aws-amplify';
import awsconfig from '../aws-exports';

// Initialize Amplify
Amplify.configure(awsconfig);

// Configure Analytics category
Analytics.configure({
    // OPTIONAL - disable Analytics if true
    disabled: false,
    // OPTIONAL - Allow recording session events. Default is true.
    autoSessionRecord: true,
});

// Function to record page views
export const recordPageView = (pageName) => {
    Analytics.record({
        name: 'pageView',
        attributes: { pageName }
    });
};

// Function to track clicks on project cards
export const recordProjectClick = (projectName) => {
    Analytics.record({
        name: 'projectClick',
        attributes: { projectName }
    });
};

// Function to track section views
export const recordSectionView = (sectionName) => {
    Analytics.record({
        name: 'sectionView',
        attributes: { sectionName }
    });
};

// Function to manually record a custom event
export const recordCustomEvent = (eventName, attributes) => {
    Analytics.record({
        name: eventName,
        attributes
    });
};

// Function to flush events immediately
export const flushEvents = () => {
    Analytics.flush();
}; 