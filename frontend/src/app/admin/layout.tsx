"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, clearTokens } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/testi", label: "Testi", icon: "¶" },
  { href: "/admin/servizi", label: "Servizi", icon: "◆" },
  { href: "/admin/testimonianze", label: "Testimonianze", icon: "❝" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "▣" },
  { href: "/admin/contatti", label: "Contatti", icon: "✉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/admin/login");
  };

  // Controlla se un link è attivo
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <span className="text-text-muted">Caricamento...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-60 bg-bg-secondary border-r border-border">
        <div className="p-6">
          <span className="font-heading text-xl text-accent font-bold">MB Admin</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition ${
                isActive(item.href)
                  ? "text-accent bg-bg-primary/50"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-red-400 text-sm transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Contenuto principale */}
      <main className="ml-0 md:ml-60 p-6 pb-20 md:pb-6">{children}</main>

      {/* Barra navigazione mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary border-t border-border flex items-center justify-around z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xl ${
              isActive(item.href) ? "text-accent" : "text-text-muted"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
}
