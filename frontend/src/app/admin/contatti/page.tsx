"use client";

import { useEffect, useState } from "react";
import { fetchAdmin } from "@/lib/api";

interface Contact {
  id: number;
  channel: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Calcola tempo relativo in italiano
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "adesso";
  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays < 30) return `${diffDays} giorni fa`;
  return date.toLocaleDateString("it-IT");
}

// Icona per canale di contatto
function channelIcon(channel: string): string {
  switch (channel?.toLowerCase()) {
    case "phone":
    case "telefono":
      return "\u260E"; // telefono
    case "whatsapp":
      return "\uD83D\uDCAC"; // fumetto
    case "email":
      return "\u2709"; // busta
    default:
      return "\u2709";
  }
}

export default function ContattiPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadContacts = async () => {
    try {
      const data = await fetchAdmin("/api/admin/contacts");
      const list = Array.isArray(data) ? data : [];
      // Ordina per più recente
      list.sort(
        (a: Contact, b: Contact) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setContacts(list);
    } catch {
      // errore silenzioso
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const toggleRead = async (contact: Contact) => {
    try {
      await fetchAdmin(`/api/admin/contacts/${contact.id}`, {
        method: "PATCH",
      });
      // Aggiorna localmente
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, read: !c.read } : c))
      );
    } catch {
      // errore silenzioso
    }
  };

  const filtered =
    filter === "unread" ? contacts.filter((c) => !c.read) : contacts;

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary">Contatti Ricevuti</h1>

      {/* Filtri */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded text-sm transition ${
            filter === "all"
              ? "bg-accent text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          }`}
        >
          Tutti ({contacts.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded text-sm transition ${
            filter === "unread"
              ? "bg-accent text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          }`}
        >
          Non letti ({contacts.filter((c) => !c.read).length})
        </button>
      </div>

      <div className="space-y-3 mt-6">
        {filtered.length === 0 && (
          <p className="text-text-muted text-sm">Nessun contatto da mostrare.</p>
        )}

        {filtered.map((contact) => (
          <button
            key={contact.id}
            onClick={() => toggleRead(contact)}
            className={`w-full text-left bg-bg-secondary p-4 rounded-lg border transition ${
              !contact.read
                ? "border-l-2 border-l-accent border-t-border border-r-border border-b-border"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{channelIcon(contact.channel)}</span>
                <div>
                  <span className="text-text-primary font-semibold text-sm">
                    {contact.name || "Anonimo"}
                  </span>
                  {contact.email && (
                    <span className="text-text-muted text-xs ml-2">{contact.email}</span>
                  )}
                  {contact.phone && (
                    <span className="text-text-muted text-xs ml-2">{contact.phone}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs">{timeAgo(contact.created_at)}</span>
                {!contact.read && (
                  <span className="w-2 h-2 bg-accent rounded-full" />
                )}
              </div>
            </div>
            {contact.message && (
              <p className="text-text-secondary text-sm mt-2 line-clamp-2">
                {contact.message}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
