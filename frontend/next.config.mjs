/** @type {import('next').NextConfig} */
const nextConfig = {
  // Quitar output: export - OpenNext maneja esto automáticamente
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
};

export default nextConfig;