"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

const C = {
  black: "#000000",
  rose: "#FF66C4",
  bordeaux: "#80004E",
  gris: "#BFBFBF",
  blanc: "#FFFFFF",
  grisDark: "#111111",
  grisMid: "#1E1E1E",
  border: "#2A2A2A",
};

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => { if (r.ok) router.replace("/compte"); })
      .finally(() => setChecking(false));
  }, [router]);

  const handleSubmit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Code invalide.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/compte"), 1200);
    } catch {
      setError("Erreur de connexion. Réessaie.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ color: C.gris, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Vérification…
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.rose} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${C.bordeaux}18 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} style={{ fontSize: 64, marginBottom: 24, color: C.rose }}>✓</motion.div>
            <p style={{ color: C.rose, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 8px" }}>Bienvenue !</p>
            <p style={{ color: C.gris, fontSize: 14 }}>Redirection vers ton compte…</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ width: "100%", maxWidth: 440, padding: "0 24px", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <motion.a href="/" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: "inline-block", textDecoration: "none", fontWeight: 900, fontSize: 22, color: C.blanc, letterSpacing: "0.05em", marginBottom: 32 }}>
                THE SHOTO<span style={{ color: C.rose }}>.</span>
              </motion.a>
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>
                ⛩️ Espace client
              </motion.p>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, color: C.blanc, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1, margin: "0 0 12px" }}>
                Connexion
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} style={{ color: C.gris, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Entre ton code client pour accéder à ton espace.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "36px 32px" }}>
              <label style={{ display: "block", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gris, marginBottom: 10, fontWeight: 600 }}>
                Code client
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Code Client"
                autoFocus
                style={{ width: "100%", background: C.grisMid, border: `1px solid ${error ? C.rose : C.border}`, color: C.blanc, fontSize: 20, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", padding: "14px 18px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = error ? C.rose : C.border; }}
              />

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: C.rose, fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleSubmit}
                disabled={loading || !code.trim()}
                whileHover={!loading && code.trim() ? { scale: 1.02 } : {}}
                whileTap={!loading && code.trim() ? { scale: 0.98 } : {}}
                style={{ width: "100%", marginTop: 20, background: loading || !code.trim() ? C.grisMid : C.bordeaux, color: loading || !code.trim() ? "#555" : C.blanc, border: "none", padding: "15px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: loading || !code.trim() ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}
              >
                {loading ? (
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    Vérification…
                  </motion.span>
                ) : "Accéder →"}
              </motion.button>

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                <p style={{ color: C.gris, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  Pas encore client ?{" "}
                  <a href="mailto:leshotomangashop@gmail.com" style={{ color: C.rose, textDecoration: "none" }}>
                    leshotomangashop@gmail.com
                  </a>
                  <br />
                  <a href="tel:0633870964" style={{ color: C.rose, textDecoration: "none" }}>
                    06 33 87 09 64
                  </a>
                </p>
              </div>
            </motion.div>

            <p style={{ textAlign: "center", color: "#333", fontSize: 11, marginTop: 24, letterSpacing: "0.15em" }}>
              © {new Date().getFullYear()} Le Shoto Manga Café — Carcassonne
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}