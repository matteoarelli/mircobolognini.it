"use client";

import { useEffect, useState } from "react";
import { fetchAdmin } from "@/lib/api";

interface Testimonial {
  id: number;
  client_name: string;
  job_type: string;
  quote: string;
  visible: boolean;
}

interface TestimonialForm {
  client_name: string;
  job_type: string;
  quote: string;
}

const emptyForm: TestimonialForm = {
  client_name: "",
  job_type: "",
  quote: "",
};

export default function TestimonianzePage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadItems = async () => {
    try {
      const data = await fetchAdmin("/api/admin/testimonials");
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // errore silenzioso
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setShowAdd(false);
    setForm({
      client_name: item.client_name,
      job_type: item.job_type,
      quote: item.quote,
    });
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm(emptyForm);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetchAdmin(`/api/admin/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await fetchAdmin("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      showToast("Salvato!");
      cancelEdit();
      await loadItems();
    } catch {
      showToast("Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchAdmin(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      showToast("Eliminato!");
      setConfirmDelete(null);
      await loadItems();
    } catch {
      showToast("Errore nell'eliminazione");
    }
  };

  const toggleVisible = async (item: Testimonial) => {
    try {
      await fetchAdmin(`/api/admin/testimonials/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...item, visible: !item.visible }),
      });
      await loadItems();
    } catch {
      showToast("Errore nel cambio visibilità");
    }
  };

  const renderForm = () => (
    <div className="bg-bg-secondary p-6 rounded-lg border border-accent/30 space-y-3 mt-4">
      <input
        type="text"
        placeholder="Nome cliente"
        value={form.client_name}
        onChange={(e) => setForm({ ...form, client_name: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Tipo di lavoro"
        value={form.job_type}
        onChange={(e) => setForm({ ...form, job_type: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <textarea
        placeholder="Citazione"
        value={form.quote}
        onChange={(e) => setForm({ ...form, quote: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full h-32 resize-y focus:outline-none focus:border-accent"
      />
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
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-text-primary">Gestione Testimonianze</h1>
        <button
          onClick={startAdd}
          className="bg-accent text-bg-primary px-4 py-2 rounded font-semibold hover:bg-accent-dark transition text-sm"
        >
          Aggiungi
        </button>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-accent text-bg-primary px-4 py-2 rounded shadow-lg z-50 text-sm font-semibold">
          {toast}
        </div>
      )}

      {showAdd && renderForm()}

      <div className="space-y-3 mt-6">
        {items.map((item) => (
          <div key={item.id}>
            {editingId === item.id ? (
              renderForm()
            ) : (
              <div className="bg-bg-secondary p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-text-primary font-semibold">{item.client_name}</span>
                    <span className="text-text-muted text-sm ml-2">— {item.job_type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleVisible(item)}
                      className={`text-xs px-2 py-1 rounded ${
                        item.visible
                          ? "bg-accent/20 text-accent"
                          : "bg-bg-primary text-text-muted"
                      }`}
                    >
                      {item.visible ? "Visibile" : "Nascosto"}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-accent hover:text-accent-light text-sm"
                    >
                      Modifica
                    </button>
                    {confirmDelete === item.id ? (
                      <span className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
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
                        onClick={() => setConfirmDelete(item.id)}
                        className="text-red-400/60 hover:text-red-400 text-sm"
                      >
                        Elimina
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-text-secondary text-sm mt-2 line-clamp-2">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
