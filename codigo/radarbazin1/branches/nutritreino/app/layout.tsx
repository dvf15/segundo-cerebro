import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Nu.tre";
const appIcon = process.env.NEXT_PUBLIC_APP_ICON || "/icon.svg";
// iOS exige PNG no ícone da tela de início (não renderiza SVG).
const appleIcon = appIcon.replace(/\.svg$/, ".png");

export const metadata: Metadata = {
  title: `${appName} — Diário nutricional`,
  description: "Registro de refeições por foto com estimativa de macros via IA.",
  appleWebApp: { capable: true, title: appName, statusBarStyle: "black-translucent" },
  icons: { icon: appIcon, apple: appleIcon },
};

export const viewport: Viewport = {
  themeColor: "#242427",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // habilita env(safe-area-inset-*) — barra inferior acima da área do iPhone
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#242427] text-slate-200 antialiased">{children}</body>
    </html>
  );
}
