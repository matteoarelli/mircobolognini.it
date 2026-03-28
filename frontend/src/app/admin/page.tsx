"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAdmin } from "@/lib/api";

interface DashboardCounts {
  services: number;
  testimonials: number;
  portfolio: number;
  contacts: number;
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({
    services: 0,
    testimonials: 0,
    portfolio: 0,
    contacts: 0,
    unreadContacts: 0,
  });

  useEffect(() => {
    // Carica i conteggi da ogni endpoint
    const loadCounts = async () => {
      try {
        const [services, testimonials, portfolio, contacts] = await Promise.all([
          fetchAdmin("/api/admin/services").catch(() => []),
          fetchAdmin("/api/admin/testimonials").catch(() => []),
          fetchAdmin("/api/admin/portfolio").catch(() => []),
          fetchAdmin("/api/admin/contacts").catch(() => []),
        ]);

        setCounts({
          services: Array.isArray(services) ? services.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          portfolio: Array.isArray(portfolio) ? portfolio.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          unreadContacts: Array.isArray(contacts)
            ? contacts.filter((c: { read: boolean }) => !c.read).length
            : 0,
        });
      } catch {
        // Errore silenzioso, i conteggi restano a 0
      }
    };

    loadCounts();
  }, []);

  const cards = [
    { label: "Testi", icon: "¶", count: "—", href: "/admin/testi" },
    { label: "Servizi", icon: "◆", count: counts.services, href: "/admin/servizi" },
    { label: "Testimonianze", icon: "❝", count: counts.testimonials, href: "/admin/testimonianze" },
    { label: "Portfolio", icon: "▣", count: counts.portfolio, href: "/admin/portfolio" },
    {
      label: "Contatti",
      icon: "✉",
      count: counts.contacts,
      href: "/admin/contatti",
      badge: counts.unreadContacts,
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-bg-secondary p-6 rounded-lg hover:border-accent/50 border border-border transition cursor-pointer relative"
          >
            <span className="text-3xl block mb-2">{card.icon}</span>
            <span className="text-2xl font-bold text-text-primary block">{card.count}</span>
            <span className="text-text-secondary text-sm">{card.label}</span>

            {card.badge !== undefined && card.badge > 0 && (
              <span className="absolute top-3 right-3 bg-accent text-bg-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {card.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
