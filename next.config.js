/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  register: true,
  dest: "public",
  sw: "service-worker.js",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "cdn.dscinflux.xyz",
      "dscinflux.xyz",
      "images.unsplash.com",
      "cdn.discordapp.com",
    ],
  },
};


module.exports = withPWA(nextConfig);
