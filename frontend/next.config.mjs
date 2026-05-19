/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
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
  // Configuración para Cloudflare Pages
  experimental: {
    // Optimizaciones para static export
  },
};

export default nextConfig;