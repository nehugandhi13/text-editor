const isDev = process.env.NODE_ENV === 'development'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
}

module.exports = withPWA(nextConfig)