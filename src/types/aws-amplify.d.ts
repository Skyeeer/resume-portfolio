declare module 'aws-amplify' {
    export const Amplify: {
        configure: (config: any) => void;
    };

    export const Analytics: {
        configure: (config: any) => void;
        record: (params: { name: string; attributes?: Record<string, any> }) => void;
        flush: () => void;
    };
} 