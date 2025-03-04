/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "kanchiuniv.ac.in",
          },
        ],
      },
};

export default nextConfig;
