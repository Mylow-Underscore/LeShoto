"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

const C = {
  black: "#000000",
  rose: "#FF66C4",
  bordeaux: "#80004E",
  gris: "#BFBFBF",
  blanc: "#FFFFFF",
  grisDark: "#111111",
  grisMid: "#1A1A1A",
  border: "#222222",
  success: "#4FD080",
  error: "#FF4444",
};

interface PanierItem {
  id: number;
  categorie: string;
  produit: string;
  modele: string | null;
  quantite: number;
  prix: string;
  personnalise: boolean;
  noteClient: string | null;
}

export default function PanierPage() {
  const [items, setItems] = useState<PanierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [noteGlobale, setNoteGlobale] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState<{ id: number; total: string } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchPanier = useCallback(async () => {
    const r = await fetch("/api/panier");
    if (r.status === 401) { router.replace("/login"); return; }
    if (r.ok) {
      const data = await r.json();
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchPanier(); }, [fetchPanier]);

  const removeItem = async (id: number) => {
    setRemoving(id);
    await fetch("/api/panier", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRemoving(null);
  };

  const calcTotal = () => {
    return items.reduce((acc, item) => {
      const p = parseFloat(item.prix.replace(",", ".").replace("€", "").trim());
      return acc + (isNaN(p) ? 0 : p * item.quantite);
    }, 0);
  };

  const totalStr = `${calcTotal().toFixed(2).replace(".", ",")}€`;

  const handleOrder = async () => {
    setOrdering(true);
    setError("");
    try {
      const r = await fetch("/api/commandes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteGlobale }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Erreur."); setOrdering(false); return; }
      setOrdered({ id: data.commandeId, total: data.total });
      setItems([]);
    } catch {
      setError("Erreur serveur.");
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ color: C.gris, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase" }}>Chargement…</motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.blanc }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 18, color: C.blanc, letterSpacing: "0.05em" }}>
          THE SHOTO<span style={{ color: C.rose }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/boutique/coques" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Coques</a>
          <a href="/boutique/goodies" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Goodies</a>
          <a href="/compte" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Mon compte</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 32px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>— Mon panier</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 48px" }}>
            {items.length === 0 && !ordered ? "Panier vide" : `${items.length + (ordered ? 0 : 0)} article${items.length > 1 ? "s" : ""}`}
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {ordered ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} style={{ fontSize: 64, marginBottom: 24 }}>✓</motion.div>
              <h2 style={{ fontWeight: 900, fontSize: 28, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 12px" }}>Commande #{ordered.id} passée !</h2>
              <p style={{ color: C.gris, fontSize: 15, lineHeight: 1.7, margin: "0 0 12px" }}>
                Total : <strong style={{ color: C.rose }}>{ordered.total}</strong>
              </p>
              <p style={{ color: C.gris, fontSize: 14, lineHeight: 1.7, margin: "0 0 32px" }}>
                Un email de confirmation avec le lien de paiement t'a été envoyé.<br />
                Tu peux aussi payer directement depuis ton espace client.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/compte" style={{ background: C.bordeaux, color: C.blanc, textDecoration: "none", padding: "14px 28px", fontSize: 12, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Mon compte →</a>
                <a href="/boutique/coques" style={{ border: `1px solid ${C.border}`, color: C.blanc, textDecoration: "none", padding: "14px 28px", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Continuer mes achats</a>
              </div>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🛒</div>
              <p style={{ color: C.gris, fontSize: 15, margin: "0 0 28px" }}>Ton panier est vide. Explore la boutique !</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/boutique/coques" style={{ background: C.bordeaux, color: C.blanc, textDecoration: "none", padding: "12px 24px", fontSize: 12, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Coques & Écrans</a>
                <a href="/boutique/goodies" style={{ border: `1px solid ${C.border}`, color: C.blanc, textDecoration: "none", padding: "12px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Goodies & Figurines</a>
              </div>
            </motion.div>
          ) : (
            <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
                <div>
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: 12, display: "flex", gap: 20, alignItems: "flex-start" }}
                      >
                        <div style={{ width: 48, height: 48, background: C.grisMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                          {item.categorie === "Cafés" || item.categorie === "Thés" || item.categorie === "Granités & Glacés" ? "☕" : item.categorie === "Figurines" ? "🗿" : item.personnalise ? "🎨" : "📱"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: C.rose, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 3px", fontWeight: 600 }}>{item.categorie}</p>
                          <p style={{ color: C.blanc, fontWeight: 700, fontSize: 15, margin: "0 0 2px" }}>{item.produit}</p>
                          {item.modele && <p style={{ color: C.gris, fontSize: 12, margin: "0 0 2px" }}>{item.modele}</p>}
                          {item.personnalise && <p style={{ color: "#5B8EFF", fontSize: 11, margin: "0 0 2px" }}>✦ Personnalisé</p>}
                          {item.noteClient && <p style={{ color: C.gris, fontSize: 12, fontStyle: "italic", margin: "4px 0 0" }}>« {item.noteClient} »</p>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                          <p style={{ color: C.rose, fontWeight: 900, fontSize: 16, margin: 0 }}>{item.prix}</p>
                          <p style={{ color: C.gris, fontSize: 11, margin: 0 }}>×{item.quantite}</p>
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            disabled={removing === item.id}
                            whileTap={{ scale: 0.9 }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: removing === item.id ? "#444" : C.error, fontSize: 11, fontFamily: "inherit", padding: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}
                          >
                            {removing === item.id ? "…" : "Retirer"}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div style={{ marginTop: 24 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 8 }}>Note pour la commande (optionnel)</label>
                    <textarea
                      value={noteGlobale}
                      onChange={(e) => setNoteGlobale(e.target.value)}
                      placeholder="Instructions spéciales, précisions sur ta commande…"
                      rows={3}
                      style={{ width: "100%", background: C.grisDark, border: `1px solid ${C.border}`, color: C.blanc, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                    />
                  </div>
                </div>

                <div style={{ position: "sticky", top: 80 }}>
                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px 24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Récapitulatif</p>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ color: C.gris, fontSize: 12, maxWidth: 180 }}>{item.produit} ×{item.quantite}</span>
                        <span style={{ color: C.blanc, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {`${(parseFloat(item.prix.replace(",", ".").replace("€", "").trim()) * item.quantite).toFixed(2).replace(".", ",")}€`}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", marginTop: 8 }}>
                      <span style={{ color: C.blanc, fontWeight: 700, fontSize: 14 }}>Total</span>
                      <span style={{ color: C.rose, fontWeight: 900, fontSize: 22 }}>{totalStr}</span>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: C.error, fontSize: 12, margin: "12px 0 0" }}>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={handleOrder}
                      disabled={ordering}
                      whileTap={!ordering ? { scale: 0.98 } : {}}
                      style={{ width: "100%", marginTop: 20, background: ordering ? C.grisMid : C.bordeaux, color: ordering ? "#555" : C.blanc, border: "none", padding: "15px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: ordering ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                    >
                      {ordering ? (
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>Traitement…</motion.span>
                      ) : "Passer la commande →"}
                    </motion.button>

                    <p style={{ color: "#444", fontSize: 11, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
                      Tu recevras un email avec le lien de paiement. Retrait en boutique uniquement.
                    </p>

                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <a href="/boutique/coques" style={{ flex: 1, textAlign: "center", border: `1px solid ${C.border}`, color: C.gris, textDecoration: "none", padding: "10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>+ Coques</a>
                      <a href="/boutique/goodies" style={{ flex: 1, textAlign: "center", border: `1px solid ${C.border}`, color: C.gris, textDecoration: "none", padding: "10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>+ Goodies</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}