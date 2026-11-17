import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider, SiteFooter, SiteHeader } from "./components/site-shell";
import { PwaControls } from "./components/pwa-controls";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ventasdeecografos | Venta de ecógrafos en Chile",
  description:
    "Ecógrafos médicos, asesoría especializada, instalación y soporte para clínicas, hospitales y profesionales de la salud en Chile.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ventasdeecografos",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        <LanguageProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <PwaControls />
        </LanguageProvider>
      </body>
    </html>
  );
}
