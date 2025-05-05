declare module 'aws-exports' {
    const config: {
        aws_project_region: string;
        aws_cognito_identity_pool_id: string;
        aws_cognito_region: string;
        aws_mobile_analytics_app_id: string;
        aws_mobile_analytics_app_region: string;
    };
    export default config;
}

declare module '@/lib/analytics' {
    export function recordPageView(pageName: string): void;
    export function recordProjectClick(projectName: string): void;
    export function recordSectionView(sectionName: string): void;
    export function recordCustomEvent(eventName: string, attributes: Record<string, any>): void;
    export function flushEvents(): void;
} 