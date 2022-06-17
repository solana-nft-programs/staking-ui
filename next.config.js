/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    BASE_CLUSTER: process.env.BASE_CLUSTER,
  },
  async rewrites() {
    return [
      {
        source: '/:path(.*)',
        destination: '/rogue-sharks',
        has: [
          {
            type: 'host',
            value: 'stake.roguesharks.org',
          },
          {
            type: 'host',
            value: 'stake.unfrgtn.space'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
