"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Barra de navegação inferior (padrão de app nativo). Fixa, com área segura
// do iPhone e estado ativo por rota.
const ITEMS: { href: string; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    href: "/",
    label: "Diário",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={a ? 2.4 : 2}>
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20v-6h4v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "Histórico",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={a ? 2.4 : 2}>
        <path d="M4 19h16" strokeLinecap="round" />
        <path d="M5 15l4-5 4 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/pressao",
    label: "Pressão",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={a ? 2.4 : 2}>
        <path d="M3 12h4l2-5 3 10 3-7 1 2h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Perfil",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={a ? 2.4 : 2}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const path = usePathname() || "/";
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#5a5a66] bg-[#2e2e36] shadow-[0_-6px_18px_rgba(0,0,0,0.35)]"
      style={{ paddingBottom: "max(calc(env(safe-area-inset-bottom) - 18px), 4px)" }}
    >
      <div className="mx-auto grid max-w-2xl grid-cols-4">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href === "/history" && path.startsWith("/pressao") ? "/history?v=pressao" : it.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 pt-2.5 pb-1.5 text-[12px] font-semibold transition-colors ${
                active ? "text-emerald-400" : "text-slate-400 active:text-slate-200"
              }`}
            >
              <span className={`rounded-xl px-4 py-1.5 ${active ? "bg-emerald-500/15" : ""}`}>{it.icon(active)}</span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
