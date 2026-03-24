import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gestión de Flota | Comercial Proventa",
  description: "Sistema de gestión de flota de buses — Comercial Proventa",
  // 1. Enlazamos el manifest de la PWA
  manifest: "/manifest.json",
  // 2. Configuramos la experiencia nativa para iOS (iPhone/iPad)
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Funde la hora/batería del iPhone con tu fondo oscuro
    title: "Proventa", // Nombre corto que aparecerá debajo del ícono en iOS
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // 3. Recomendado para PWA: color de la barra del navegador en Android
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0a0a0a] text-slate-200`}>
        {children}
      </body>
    </html>
  );
}