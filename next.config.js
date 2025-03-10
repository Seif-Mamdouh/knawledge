/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    domains: ['images.ctfassets.net'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
