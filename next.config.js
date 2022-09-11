/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: 'https://api.sentries.io/v1/:path*'
      }
    ]
  }
}
