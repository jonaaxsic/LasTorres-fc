/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "paaekmkjtbdburaxpcsv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
        pathname: "/**",
      },
    ],
  },
  // For static export - allow dynamic routes
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;