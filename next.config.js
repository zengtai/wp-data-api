/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        path: false,
        process: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
