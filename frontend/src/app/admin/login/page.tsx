"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/admin");
    } catch {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="bg-bg-secondary p-8 rounded-lg w-full max-w-sm">
        {/* Monogramma MB */}
        <div className="text-center mb-6">
          <span className="font-heading text-4xl text-accent font-bold">MB</span>
        </div>

        <h1 className="font-heading text-2xl text-text-primary text-center mb-6">
          Pannello Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-bg-primary border border-border text-text-primary rounded p-3 w-full focus:outline-none focus:border-accent"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-bg-primary w-full py-3 rounded font-semibold hover:bg-accent-dark transition disabled:opacity-50"
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
