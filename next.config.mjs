/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['firebasestorage.googleapis.com'],
    },
  };
  
  // Если вы планируете использовать Sentry в будущем, вы можете раскомментировать эти строки
  // import { withSentryConfig } from '@sentry/nextjs';
  // const sentryWebpackPluginOptions = {
  //   silent: true,
  //   org: "leadai-e0",
  //   project: "leadai",
  //   widenClientFileUpload: true,
  //   transpileClientSDK: true,
  //   hideSourceMaps: true,
  //   disableLogger: true,
  //   automaticVercelMonitors: true,
  // };
  // export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
  
  export default nextConfig;