/* eslint-disable */
// Fallback configuration for builds

const awsmobile = {
    "aws_project_region": typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
    "aws_cognito_identity_pool_id": typeof process !== 'undefined' && process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || "",
    "aws_cognito_region": typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
    "aws_mobile_analytics_app_id": typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PINPOINT_APP_ID || "",
    "aws_mobile_analytics_app_region": typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PINPOINT_REGION || "eu-central-1"
};

export default awsmobile; 