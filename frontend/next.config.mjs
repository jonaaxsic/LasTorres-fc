/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Imágenes de Supabase
    remotePatterns: [
      {
        protocol: "https",
        hostname: "paaekmkjtbdburaxpcsv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Para imágenes placeholder/debug
      {
        protocol: "https",
        hostname: "placeholder.com",
        pathname: "/**",
      },
    ],
    // Formats modernos
    formats: ["image/avif", "image/webp"],
    // device sizes responsivos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;