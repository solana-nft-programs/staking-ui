const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    MAINNET_SECONDARY: process.env.MAINNET_SECONDARY,
    GEO_LOCATION_API_KEY: process.env.GEO_LOCATION_API_KEY,
    BASE_CLUSTER: process.env.BASE_CLUSTER,
    BYPASS_REGION_CHECK: process.env.BYPASS_REGION_CHECK,
  },
}

module.exports =
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
    ? withSentryConfig(nextConfig, {
        // Additional config options for the Sentry Webpack plugin. Keep in mind that
        // the following options are set automatically, and overriding them is not
        // recommended:
        //   release, url, org, project, authToken, configFile, stripPrefix,
        //   urlPrefix, include, ignore

        silent: true, // Suppresses all logs
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options.
      })
    : nextConfig
