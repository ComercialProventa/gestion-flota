import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gestión de Flota | Comercial Proventa",
  description: "Sistema de gestión de flota de buses — Comercial Proventa",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Proventa",
  },
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
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          })();
        `}} />
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans min-h-full flex flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}