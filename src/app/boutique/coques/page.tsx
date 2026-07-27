"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const C = {
  black: "#000000",
  rose: "#FF66C4",
  bordeaux: "#80004E",
  gris: "#BFBFBF",
  blanc: "#FFFFFF",
  grisDark: "#111111",
  grisMid: "#222222",
  border: "#2A2A2A",
};

const PRODUCTS_COQUES = [
  { id: 1, name: "Coque Souple Transparente", price: "12,00€", models: ["iPhone 14", "iPhone 15", "Samsung S23", "Samsung S24"], tag: "Bestseller" },
  { id: 2, name: "Coque Rigide Mate", price: "15,00€", models: ["iPhone 14", "iPhone 15", "iPhone 15 Pro", "Samsung S23", "Samsung S24"], tag: null },
  { id: 3, name: "Coque Silicone Premium", price: "18,00€", models: ["iPhone 14", "iPhone 14 Pro", "iPhone 15", "iPhone 15 Pro", "Samsung S23", "Samsung S24 Ultra"], tag: "Premium" },
  { id: 4, name: "Coque Cuir Synthétique", price: "24,00€", models: ["iPhone 15", "iPhone 15 Pro", "Samsung S24", "Samsung S24 Ultra"], tag: "Exclusif" },
];

const PRODUCTS_ECRANS = [
  { id: 5, name: "Verre Trempé Standard", price: "9,00€", models: ["iPhone 14", "iPhone 15", "Samsung S23", "Samsung S24"], tag: null },
  { id: 6, name: "Verre Trempé Anti-Lumière Bleue", price: "14,00€", models: ["iPhone 14", "iPhone 15", "iPhone 15 Pro", "Samsung S23", "Samsung S24"], tag: "Populaire" },
  { id: 7, name: "Film Hydrogel Mat", price: "11,00€", models: ["Tous modèles compatibles"], tag: null },
  { id: 8, name: "Verre Trempé 3D Incurvé", price: "16,00€", models: ["Samsung S23", "Samsung S24", "Samsung S24 Ultra"], tag: "Samsung only" },
];

function ProductCard({ product, onCustomize }: { product: typeof PRODUCTS_COQUES[0]; onCustomize?: () => void }) {
  const [selectedModel, setSelectedModel] = useState(product.models[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        background: C.grisDark,
        border: `1px solid ${C.border}`,
        padding: "28px 24px",
        position: "relative",
        cursor: "default",
      }}
    >
      {product.tag && (
        <div style={{
          position: "absolute", top: -1, right: 20,
          background: C.bordeaux, color: C.blanc,
          fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", padding: "4px 12px",
        }}>
          {product.tag}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ width: 100, height: 100, background: C.grisMid, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
          📱
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: C.blanc, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          {product.name}
        </h3>
        <p style={{ fontWeight: 900, fontSize: 20, color: C.rose, margin: 0 }}>
          {product.price}
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 8 }}>
          Modèle
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            width: "100%", background: C.grisMid,
            border: `1px solid ${C.border}`, color: C.blanc,
            padding: "10px 12px", fontSize: 13,
            fontFamily: "inherit", outline: "none", cursor: "pointer",
          }}
        >
          {product.models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
          style={{
            background: added ? "#1a3a1a" : C.bordeaux,
            color: added ? "#4FD080" : C.blanc,
            border: "none", padding: "12px",
            fontSize: 12, fontWeight: 800,
            letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.3s, color 0.3s",
          }}
        >
          {added ? "✓ Ajouté" : "Ajouter au panier"}
        </motion.button>

        {onCustomize && (
          <motion.button
            onClick={onCustomize}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: C.rose,
              border: `1px solid ${C.rose}`,
              padding: "10px",
              fontSize: 12, fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✦ Personnaliser
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function CustomizerModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState("iPhone 15");
  const [selectedCase, setSelectedCase] = useState("Coque Rigide Mate");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: C.grisDark,
          border: `1px solid ${C.border}`,
          width: "100%", maxWidth: 680,
          maxHeight: "90vh", overflowY: "auto",
          padding: "40px 36px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            background: "none", border: "none",
            color: C.gris, fontSize: 24, cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <div style={{ fontSize: 56, marginBottom: 20 }}>✓</div>
            <h3 style={{ fontWeight: 900, fontSize: 24, color: C.blanc, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Commande envoyée !
            </h3>
            <p style={{ color: C.gris, fontSize: 14, lineHeight: 1.7 }}>
              On t'envoie un récap par mail et on commence la personnalisation.<br />
              Délai : 3-5 jours ouvrés.
            </p>
            <button onClick={onClose} style={{ marginTop: 24, background: C.bordeaux, color: C.blanc, border: "none", padding: "12px 32px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Fermer
            </button>
          </motion.div>
        ) : (
          <>
            <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              — Personnalisation
            </p>
            <h2 style={{ fontWeight: 900, fontSize: 28, color: C.blanc, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 32px" }}>
              Ta coque,<br />ton image.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 8 }}>Modèle</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                  {["iPhone 14", "iPhone 14 Pro", "iPhone 15", "iPhone 15 Pro", "Samsung S23", "Samsung S24", "Samsung S24 Ultra"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 8 }}>Type de coque</label>
                <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                  {["Coque Souple Transparente", "Coque Rigide Mate", "Coque Silicone Premium"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 12 }}>Ta photo</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? C.rose : C.border}`,
                  background: dragging ? `${C.rose}08` : C.grisMid,
                  padding: "40px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" style={{ maxHeight: 180, maxWidth: "100%", objectFit: "contain", display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: C.gris, fontSize: 12, margin: 0 }}>Clique pour changer</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📸</div>
                    <p style={{ color: C.gris, fontSize: 14, margin: "0 0 4px" }}>Glisse ta photo ici ou clique pour parcourir</p>
                    <p style={{ color: "#555", fontSize: 12, margin: 0 }}>JPG, PNG, WEBP — max 20 Mo — résolution minimale 1000×1000px recommandée</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 8 }}>Note / instructions (optionnel)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: image centrée, fond transparent, texte 'Le Shoto' en bas…"
                rows={3}
                style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ padding: "16px 20px", background: C.grisMid, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.gris, fontSize: 13 }}>Coque personnalisée ({selectedCase})</span>
                <span style={{ color: C.blanc, fontWeight: 700, fontSize: 13 }}>+8,00€</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.gris, fontSize: 13 }}>Modèle : {selectedModel}</span>
                <span style={{ color: C.rose, fontWeight: 900, fontSize: 16 }}>Total : ~26,00€</span>
              </div>
            </div>

            <motion.button
              onClick={() => { if (!preview) { alert("Ajoute d'abord ta photo !"); return; } setSubmitted(true); }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              style={{
                width: "100%",
                background: C.bordeaux, color: C.blanc,
                border: "none", padding: "16px",
                fontSize: 13, fontWeight: 800,
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Envoyer ma commande →
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function BoutiqueCoques() {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.blanc }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 18, color: C.blanc, letterSpacing: "0.05em" }}>
          THE SHOTO<span style={{ color: C.rose }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/boutique/coques" style={{ color: C.rose, textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Coques & Écrans</a>
          <a href="/boutique/goodies" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Goodies & Figurines</a>
          <a href="/login" style={{ background: C.bordeaux, color: C.blanc, padding: "8px 16px", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Mon compte</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>
            — Boutique exclusive
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95, margin: "0 0 16px" }}>
            Coques &<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${C.blanc}` }}>Écrans</span>
          </h1>
          <p style={{ color: C.gris, fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 0 64px" }}>
            Protège ton téléphone avec style. Personnalise ta coque avec ta propre image — livraison en boutique ou à domicile.
          </p>
        </motion.div>

        <motion.div
          onClick={() => setCustomizerOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          style={{
            background: `linear-gradient(135deg, ${C.bordeaux} 0%, #3D0024 100%)`,
            padding: "36px 40px",
            marginBottom: 64,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            border: `1px solid ${C.bordeaux}`,
          }}
        >
          <div>
            <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>✦ Nouveauté</p>
            <h2 style={{ fontWeight: 900, fontSize: 24, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
              Coque Personnalisée
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
              Upload ta photo et on imprime ta coque unique. Délai 3-5 jours.
            </p>
          </div>
          <div style={{ flexShrink: 0, fontSize: 48 }}>🎨 →</div>
        </motion.div>

        <div style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 32, height: 3, background: C.rose }} />
            <h2 style={{ fontWeight: 900, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: C.rose, margin: 0 }}>Coques de protection</h2>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {PRODUCTS_COQUES.map((p) => (
              <ProductCard key={p.id} product={p} onCustomize={() => setCustomizerOpen(true)} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 32, height: 3, background: C.rose }} />
            <h2 style={{ fontWeight: 900, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: C.rose, margin: 0 }}>Protection d'écran</h2>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {PRODUCTS_ECRANS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 80, padding: "32px 40px", background: C.grisDark, border: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { icon: "📦", title: "Retrait en boutique", desc: "23 rue Georges Clémenceau, Carcassonne" },
            { icon: "📞", title: "Commande par tel", desc: "06 33 87 09 64" },
            { icon: "✉️", title: "Par mail", desc: "leshotomangashop@gmail.com" },
          ].map((item) => (
            <div key={item.title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: C.blanc, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ color: C.gris, fontSize: 12, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {customizerOpen && <CustomizerModal onClose={() => setCustomizerOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}