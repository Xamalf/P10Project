/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.alias.canvas = false;
      
        return config;
      },
};

export default nextConfig;
