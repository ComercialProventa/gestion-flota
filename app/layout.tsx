import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Inicializamos la tipografía corporativa
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Asegura que el texto se muestre rápido
});

export const metadata: Metadata = {
  title: "Gestión de Flota | Comercial Proventa",
  description: "Sistema de gestión de flota de buses — Comercial Proventa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Mantenemos antialiased para que los textos oscuros se vean ultra nítidos
    <html lang="es" className="h-full antialiased">
      {/* 3. Inyectamos inter.className directamente en el body */}
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0a0a0a] text-slate-200`}>
        {children}
      </body>
    </html>
  );
}