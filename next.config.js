const HOST_MAPPINGS = [
  {
    name: 'rogue-sharks',
    hostname: 'stake.roguesharks.org',
  },
  {
    name: 'Orbit',
    hostname: 'stake.unfrgtn.space',
  },
  {
    name: 'degengod',
    hostname: 'stake.degengod.xyz',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
    BASE_CLUSTER: process.env.BASE_CLUSTER,
  },
  async rewrites() {
    return HOST_MAPPINGS.reduce(
      (acc, mapping) =>
        mapping.hostname
          ? [
              ...acc,
              {
                source: '/:path(.*)',
                destination: `/${mapping.name}`,
                has: [
                  {
                    type: 'host',
                    value: mapping.hostname,
                  },
                ],
              },
            ]
          : acc,
      []
    )
  },
  async redirects() {
    return HOST_MAPPINGS.reduce(
      (acc, mapping) =>
        mapping.hostname
          ? [
              ...acc,
              {
                source: '/',
                destination: `/${mapping.name}`,
                permanent: false,
                has: [
                  {
                    type: 'host',
                    value: mapping.hostname,
                  },
                ],
              },
            ]
          : acc,
      []
    )
  },
}

module.exports = nextConfig
