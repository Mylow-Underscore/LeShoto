"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
      } else {
        router.refresh();
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Code
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />
        </label>

        {error ? <p style={{ color: "red" }}>{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}