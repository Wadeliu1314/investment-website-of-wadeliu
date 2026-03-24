/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // 👈 最重要：导出静态网站
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
