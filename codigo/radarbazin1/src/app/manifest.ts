import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Nu.tre";
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON || "/icon.svg";
  const appIconPng = appIcon.replace(/\.svg$/, ".png");
  return {
    name: `${appName} — Diário nutricional`,
    short_name: appName,
    description: "Registro de refeições por foto com estimativa de macros via IA.",
    start_url: "/",
    display: "standalone",
    background_color: "#242427",
    theme_color: "#242427",
    icons: [
      { src: appIconPng, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: appIconPng, sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: appIcon, sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
