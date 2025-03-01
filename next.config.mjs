/** @type {import('next').NextConfig} */
const nextConfig = {

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
