"use client";

import { useEffect, useState } from "react";
import { fetchAdmin } from "@/lib/api";

interface ContentData {
  hero: { subtitle: string; tagline: string; cta_text: string };
  about: { title: string; text: string };
  cta: { title: string; subtitle: string };
}

export default function TestiPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchAdmin("/api/admin/content")
      .then(setContent)
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const saveSection = async (section: string, data: Record<string, string>) => {
    setSaving(section);
    try {
      await fetchAdmin(`/api/admin/content/${section}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showToast("Salvato con successo!");
    } catch {
      showToast("Errore nel salvataggio");
    } finally {
      setSaving(null);
    }
  };

  if (!content) {
    return <p className="text-text-muted">Caricamento...</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary">Gestione Testi</h1>

      {/* Toast di conferma */}
      {toast && (
        <div className="fixed top-4 right-4 bg-accent text-bg-primary px-4 py-2 rounded shadow-lg z-50 text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="space-y-6 mt-6">
        {/* Sezione Hero */}
        <div className="bg-bg-secondary p-6 rounded-lg">
          <h2 className="font-heading text-lg text-accent mb-4">Hero</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Sottotitolo"
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Tagline"
              value={content.hero.tagline}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Testo CTA"
              value={content.hero.cta_text}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, cta_text: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => saveSection("hero", content.hero)}
              disabled={saving === "hero"}
              className="bg-accent text-bg-primary px-6 py-2 rounded font-semibold hover:bg-accent-dark transition disabled:opacity-50"
            >
              {saving === "hero" ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>

        {/* Sezione Chi Sono */}
        <div className="bg-bg-secondary p-6 rounded-lg">
          <h2 className="font-heading text-lg text-accent mb-4">Chi Sono</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Titolo"
              value={content.about.title}
              onChange={(e) =>
                setContent({ ...content, about: { ...content.about, title: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <textarea
              placeholder="Testo"
              value={content.about.text}
              onChange={(e) =>
                setContent({ ...content, about: { ...content.about, text: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full h-40 resize-y focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => saveSection("about", content.about)}
              disabled={saving === "about"}
              className="bg-accent text-bg-primary px-6 py-2 rounded font-semibold hover:bg-accent-dark transition disabled:opacity-50"
            >
              {saving === "about" ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>

        {/* Sezione CTA */}
        <div className="bg-bg-secondary p-6 rounded-lg">
          <h2 className="font-heading text-lg text-accent mb-4">CTA</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Titolo"
              value={content.cta.title}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, title: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Sottotitolo"
              value={content.cta.subtitle}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, subtitle: e.target.value } })
              }
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => saveSection("cta", content.cta)}
              disabled={saving === "cta"}
              className="bg-accent text-bg-primary px-6 py-2 rounded font-semibold hover:bg-accent-dark transition disabled:opacity-50"
            >
              {saving === "cta" ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
