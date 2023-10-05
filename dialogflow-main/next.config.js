/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dialogflow-1-x5006770.deta.app/api/:path*',
      },
    ]
  },


}

module.exports = nextConfig
