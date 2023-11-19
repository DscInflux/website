const localesConfig = require("./src/configurations/locales.config");
const influxConfig = require("./src/configurations/influx.config");

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  register: true,
  dest: "public",
  sw: "service-worker.js",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  i18n: {
    locales: localesConfig.map((locale) => locale.value),
    defaultLocale: localesConfig.find((el) => el.default).value,
  },
  images: {
    domains: [
      "cdn.dscinflux.xyz",
      "dscinflux.xyz",
      "images.unsplash.com",
      "cdn.discordapp.com",
    ],
  },
  rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://api.dscinflux.xyz/:path*",
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
