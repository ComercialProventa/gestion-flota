import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Inicializamos el plugin PWA con sintaxis moderna
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // Excelente práctica
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// Exportamos la configuración envuelta en la PWA
export default withPWA(nextConfig);