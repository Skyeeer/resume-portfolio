declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_AWS_REGION: string;
        NEXT_PUBLIC_PINPOINT_REGION: string;
        NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: string;
        NEXT_PUBLIC_PINPOINT_APP_ID: string;
    }
} 