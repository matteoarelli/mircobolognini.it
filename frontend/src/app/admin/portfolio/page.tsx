"use client";

import { useEffect, useState } from "react";
import { fetchAdmin } from "@/lib/api";

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
  visible: boolean;
}

interface ProjectForm {
  title: string;
  description: string;
  category: string;
  images: string;
  visible: boolean;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  category: "",
  images: "",
  visible: true,
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [portfolioVisible, setPortfolioVisible] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadProjects = async () => {
    try {
      const data = await fetchAdmin("/api/admin/portfolio");
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      // errore silenzioso
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchAdmin("/api/admin/settings");
      setPortfolioVisible(data.portfolio_visible === "true");
    } catch {
      // errore silenzioso
    }
  };

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, []);

  const togglePortfolioGlobal = async () => {
    const newVal = !portfolioVisible;
    try {
      await fetchAdmin("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ portfolio_visible: newVal ? "true" : "false" }),
      });
      setPortfolioVisible(newVal);
      showToast(newVal ? "Portfolio visibile sul sito" : "Portfolio nascosto dal sito");
    } catch {
      showToast("Errore nel cambio impostazione");
    }
  };

  const startEdit = (project: PortfolioProject) => {
    setEditingId(project.id);
    setShowAdd(false);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      images: project.images.join(", "),
      visible: project.visible,
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

  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    category: form.category,
    images: form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    visible: form.visible,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetchAdmin(`/api/admin/portfolio/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(buildPayload()),
        });
      } else {
        await fetchAdmin("/api/admin/portfolio", {
          method: "POST",
          body: JSON.stringify(buildPayload()),
        });
      }
      showToast("Salvato!");
      cancelEdit();
      await loadProjects();
    } catch {
      showToast("Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchAdmin(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      showToast("Eliminato!");
      setConfirmDelete(null);
      await loadProjects();
    } catch {
      showToast("Errore nell'eliminazione");
    }
  };

  const toggleVisible = async (project: PortfolioProject) => {
    try {
      await fetchAdmin(`/api/admin/portfolio/${project.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...project, visible: !project.visible }),
      });
      await loadProjects();
    } catch {
      showToast("Errore nel cambio visibilità");
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
        placeholder="Descrizione"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full h-32 resize-y focus:outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="URL immagini (separati da virgola)"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
        className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
      />
      <label className="flex items-center gap-2 text-text-secondary text-sm">
        <input
          type="checkbox"
          checked={form.visible}
          onChange={(e) => setForm({ ...form, visible: e.target.checked })}
          className="accent-accent"
        />
        Visibile
      </label>
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
        <h1 className="font-heading text-2xl text-text-primary">Gestione Portfolio</h1>
        <button
          onClick={startAdd}
          className="bg-accent text-bg-primary px-4 py-2 rounded font-semibold hover:bg-accent-dark transition text-sm"
        >
          Aggiungi Progetto
        </button>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-accent text-bg-primary px-4 py-2 rounded shadow-lg z-50 text-sm font-semibold">
          {toast}
        </div>
      )}

      {/* Toggle globale visibilità portfolio */}
      <div className="bg-bg-secondary p-4 rounded-lg border border-border mt-6 flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">Portfolio visibile sul sito</span>
        <button
          onClick={togglePortfolioGlobal}
          className={`relative w-12 h-6 rounded-full transition ${
            portfolioVisible ? "bg-accent" : "bg-bg-primary"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              portfolioVisible ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {showAdd && renderForm()}

      <div className="space-y-3 mt-6">
        {projects.map((project) => (
          <div key={project.id}>
            {editingId === project.id ? (
              renderForm()
            ) : (
              <div className="bg-bg-secondary p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-text-primary font-semibold">{project.title}</span>
                    <span className="text-text-muted text-sm ml-2">— {project.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleVisible(project)}
                      className={`text-xs px-2 py-1 rounded ${
                        project.visible
                          ? "bg-accent/20 text-accent"
                          : "bg-bg-primary text-text-muted"
                      }`}
                    >
                      {project.visible ? "Visibile" : "Nascosto"}
                    </button>
                    <button
                      onClick={() => startEdit(project)}
                      className="text-accent hover:text-accent-light text-sm"
                    >
                      Modifica
                    </button>
                    {confirmDelete === project.id ? (
                      <span className="flex gap-1">
                        <button
                          onClick={() => handleDelete(project.id)}
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
                        onClick={() => setConfirmDelete(project.id)}
                        className="text-red-400/60 hover:text-red-400 text-sm"
                      >
                        Elimina
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
