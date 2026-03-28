"use client";

import { useEffect, useState } from "react";
import { fetchAdmin } from "@/lib/api";

interface Service {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  sub_services: string[];
  sort_order: number;
  active: boolean;
}

interface ServiceForm {
  title: string;
  short_description: string;
  long_description: string;
  sub_services: string;
  sort_order: number;
  active: boolean;
}

const emptyForm: ServiceForm = {
  title: "",
  short_description: "",
  long_description: "",
  sub_services: "",
  sort_order: 0,
  active: true,
};

export default function ServiziPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadServices = async () => {
    try {
      const data = await fetchAdmin("/api/admin/services");
      setServices(Array.isArray(data) ? data.sort((a: Service, b: Service) => a.sort_order - b.sort_order) : []);
    } catch {
      // errore silenzioso
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const startEdit = (svc: Service) => {
    setEditingId(svc.id);
    setShowAdd(false);
    setForm({
      title: svc.title,
      short_description: svc.short_description,
      long_description: svc.long_description,
      sub_services: svc.sub_services.join(", "),
      sort_order: svc.sort_order,
      active: svc.active,
    });
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: services.length + 1 });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const buildPayload = () => ({
    title: form.title,
    short_description: form.short_description,
    long_description: form.long_description,
    sub_services: form.sub_services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    sort_order: form.sort_order,
    active: form.active,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetchAdmin(`/api/admin/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(buildPayload()),
        });
      } else {
        await fetchAdmin("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(buildPayload()),
        });
      }
      showToast("Salvato!");
      cancelEdit();
      await loadServices();
    } catch {
      showToast("Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchAdmin(`/api/admin/services/${id}`, { method: "DELETE" });
      showToast("Eliminato!");
      setConfirmDelete(null);
      await loadServices();
    } catch {
      showToast("Errore nell'eliminazione");
    }
  };

  const renderForm = () => (
    <div className="bg-bg-secondary p-6 rounded-lg border border-accent/30 space-y-3 mt-4">
      <input
        type="text"
        placeholder="Titolo"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <textarea
        placeholder="Descrizione breve"
        value={form.short_description}
        onChange={(e) => setForm({ ...form, short_description: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full h-24 resize-y focus:outline-none focus:border-accent"
      />
      <textarea
        placeholder="Descrizione estesa"
        value={form.long_description}
        onChange={(e) => setForm({ ...form, long_description: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full h-32 resize-y focus:outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Sotto-servizi (separati da virgola)"
        value={form.sub_services}
        onChange={(e) => setForm({ ...form, sub_services: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <div className="flex gap-4 items-center">
        <input
          type="number"
          placeholder="Ordine"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
          className="bg-bg-primary border border-border text-text-primary rounded p-3 w-24 focus:outline-none focus:border-accent"
        />
        <label className="flex items-center gap-2 text-text-secondary text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="accent-accent"
          />
          Attivo
        </label>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-bg-primary px-6 py-2 rounded font-semibold hover:bg-accent-dark transition disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva"}
        </button>
        <button
          onClick={cancelEdit}
          className="text-text-muted hover:text-text-primary transition px-4 py-2"
        >
          Annulla
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-heading text-xl sm:text-2xl text-text-primary">Gestione Servizi</h1>
        <button
          onClick={startAdd}
          className="bg-accent text-bg-primary px-4 py-2 rounded font-semibold hover:bg-accent-dark transition text-sm"
        >
          Aggiungi Servizio
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-accent text-bg-primary px-4 py-2 rounded shadow-lg z-50 text-sm font-semibold">
          {toast}
        </div>
      )}

      {showAdd && renderForm()}

      <div className="space-y-3 mt-6">
        {services.map((svc) => (
          <div key={svc.id}>
            {editingId === svc.id ? (
              renderForm()
            ) : (
              <div className="bg-bg-secondary p-4 rounded-lg border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="bg-bg-primary text-accent text-xs font-bold px-2 py-1 rounded shrink-0">
                      {svc.sort_order}
                    </span>
                    <span className="text-text-primary font-semibold truncate">{svc.title}</span>
                    {!svc.active && (
                      <span className="text-text-muted text-xs shrink-0">(disattivato)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === svc.id ? null : svc.id)
                      }
                      className="text-text-muted hover:text-text-primary text-sm"
                    >
                      {expandedId === svc.id ? "▲" : "▼"}
                    </button>
                    <button
                      onClick={() => startEdit(svc)}
                      className="text-accent hover:text-accent-light text-sm"
                    >
                      Modifica
                    </button>
                    {confirmDelete === svc.id ? (
                      <span className="flex gap-1">
                        <button
                          onClick={() => handleDelete(svc.id)}
                          className="text-red-400 text-sm font-bold"
                        >
                          Conferma
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-text-muted text-sm"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(svc.id)}
                        className="text-red-400/60 hover:text-red-400 text-sm"
                      >
                        Elimina
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === svc.id && (
                  <div className="mt-3 pt-3 border-t border-border text-sm text-text-secondary space-y-2">
                    <p>{svc.short_description}</p>
                    {svc.long_description && (
                      <p className="text-text-muted">{svc.long_description}</p>
                    )}
                    {svc.sub_services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {svc.sub_services.map((sub, i) => (
                          <span
                            key={i}
                            className="bg-bg-primary px-2 py-0.5 rounded text-xs text-text-secondary"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
