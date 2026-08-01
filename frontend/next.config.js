/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://backend:8000";

    return [{ source: "/api/asciify", destination: `${backend}/asciify` }];
  },
};

module.exports = nextConfig;
