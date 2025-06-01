/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    domains: [
      "media.coolmate.me",
      "media3.coolmate.me",
      "www.coolmate.me",
      "coolmate.me",
      "mcdn.coolmate.me",
      "ui-avatars.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fonts.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
