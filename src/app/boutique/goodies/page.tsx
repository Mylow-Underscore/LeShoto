"use client";

import { useState } from "react";
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

const CATEGORIES = ["Tout", "Figurines", "Posters", "Accessoires", "Édition Limitée"];

const PRODUCTS = [
  { id: 1, name: "Figurine Nendoroid — Naruto", price: "42,00€", cat: "Figurines", tag: "Rupture", emoji: "🗡️", desc: "Nendoroid officiel 10cm avec accessoires" },
  { id: 2, name: "Figurine POP! — Gojo Satoru", price: "18,00€", cat: "Figurines", tag: null, emoji: "👁️", desc: "Funko POP! édition Jujutsu Kaisen" },
  { id: 3, name: "Figurine Ichiban Kuji — Luffy Gear 5", price: "65,00€", cat: "Figurines", tag: "Édition Limitée", emoji: "🌟", desc: "Figurine premium 20cm, pièce unique" },
  { id: 4, name: "Figurine Articulée — Demon Slayer", price: "34,00€", cat: "Figurines", tag: null, emoji: "🌊", desc: "Figurine 15cm entièrement articulée, SH Figuarts" },
  { id: 5, name: "Poster A2 — Akira", price: "12,00€", cat: "Posters", tag: null, emoji: "🏍️", desc: "Impression haute qualité 42×59cm, papier mat" },
  { id: 6, name: "Poster A1 — Dragon Ball Z", price: "18,00€", cat: "Posters", tag: "Bestseller", emoji: "💥", desc: "Print collector 59×84cm" },
  { id: 7, name: "Poster Encadré — Spirited Away", price: "28,00€", cat: "Posters", tag: "Exclusif", emoji: "🐉", desc: "Impression + cadre noir 30×40cm" },
  { id: 8, name: "Tote Bag — Le Shoto", price: "14,00€", cat: "Accessoires", tag: null, emoji: "🛍️", desc: "Coton épais, logo brodé The Shoto" },
  { id: 9, name: "Mug Thermos — Manga Style", price: "22,00€", cat: "Accessoires", tag: null, emoji: "☕", desc: "500ml, double paroi, motifs manga" },
  { id: 10, name: "Pin's émaillé — Set de 3", price: "9,00€", cat: "Accessoires", tag: "Bestseller", emoji: "✨", desc: "Pin's exclusifs Le Shoto, motifs originaux" },
  { id: 11, name: "Keychain Acrylique — Personnages", price: "7,50€", cat: "Accessoires", tag: null, emoji: "🔑", desc: "Porte-clé acrylique double face 6cm" },
  { id: 12, name: "Box Mystère Manga", price: "35,00€", cat: "Édition Limitée", tag: "⚡ Stock limité", emoji: "📦", desc: "5-7 articles : figurine, poster, goodies — surprise !" },
];

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [added, setAdded] = useState(false);
  const isRupture = product.tag === "Rupture";

  const handleAdd = () => {
    if (isRupture) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={!isRupture ? { y: -4 } : {}}
      style={{
        background: C.grisDark,
        border: `1px solid ${C.border}`,
        padding: "24px",
        position: "relative",
        opacity: isRupture ? 0.6 : 1,
      }}
    >
      {product.tag && (
        <div style={{
          position: "absolute", top: -1, right: 16,
          background: product.tag === "Rupture" ? "#333" : product.tag.includes("⚡") ? "#3a2000" : C.bordeaux,
          color: product.tag === "Rupture" ? C.gris : product.tag.includes("⚡") ? "#FFA500" : C.blanc,
          fontSize: 9, fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", padding: "4px 10px",
        }}>
          {product.tag}
        </div>
      )}

      <div style={{
        height: 120, background: C.grisMid,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, marginBottom: 16,
      }}>
        {product.emoji}
      </div>

      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.rose, fontWeight: 700 }}>
          {product.cat}
        </span>
      </div>
      <h3 style={{ fontWeight: 800, fontSize: 15, color: C.blanc, margin: "0 0 4px", lineHeight: 1.3 }}>
        {product.name}
      </h3>
      <p style={{ color: C.gris, fontSize: 12, margin: "0 0 12px", lineHeight: 1.5 }}>
        {product.desc}
      </p>
      <p style={{ fontWeight: 900, fontSize: 20, color: C.rose, margin: "0 0 16px" }}>
        {product.price}
      </p>

      <motion.button
        onClick={handleAdd}
        disabled={isRupture}
        whileTap={!isRupture ? { scale: 0.97 } : {}}
        style={{
          width: "100%",
          background: isRupture ? C.grisMid : added ? "#1a3a1a" : C.bordeaux,
          color: isRupture ? "#555" : added ? "#4FD080" : C.blanc,
          border: "none", padding: "11px",
          fontSize: 11, fontWeight: 800,
          letterSpacing: "0.15em", textTransform: "uppercase",
          cursor: isRupture ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {isRupture ? "Rupture de stock" : added ? "✓ Ajouté" : "Ajouter au panier"}
      </motion.button>
    </motion.div>
  );
}

export default function BoutiqueGoodies() {
  const [activecat, setActivecat] = useState("Tout");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activecat === "Tout" || p.cat === activecat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.blanc }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 18, color: C.blanc, letterSpacing: "0.05em" }}>
          THE SHOTO<span style={{ color: C.rose }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/boutique/coques" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Coques & Écrans</a>
          <a href="/boutique/goodies" style={{ color: C.rose, textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Goodies & Figurines</a>
          <a href="/login" style={{ background: C.bordeaux, color: C.blanc, padding: "8px 16px", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Mon compte</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>— Boutique exclusive</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95, margin: "0 0 16px" }}>
            Goodies &<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${C.blanc}` }}>Figurines</span>
          </h1>
          <p style={{ color: C.gris, fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 0 48px" }}>
            Figures de collection, posters, accessoires et éditions limitées — tout l'univers manga dans ta chambre.
          </p>
        </motion.div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 48, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <input
              type="text"
              placeholder="Rechercher un produit…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", background: C.grisDark,
                border: `1px solid ${C.border}`, color: C.blanc,
                padding: "12px 16px", fontSize: 14,
                fontFamily: "inherit", outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActivecat(cat)}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: activecat === cat ? C.bordeaux : C.grisDark,
                  color: activecat === cat ? C.blanc : C.gris,
                  border: `1px solid ${activecat === cat ? C.bordeaux : C.border}`,
                  padding: "10px 18px",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activecat + search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: C.gris }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 15 }}>Aucun produit trouvé pour "{search}"</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 80,
            background: `linear-gradient(135deg, ${C.bordeaux} 0%, #3D0024 100%)`,
            padding: "40px 48px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>Tu veux autre chose ?</p>
            <h3 style={{ fontWeight: 900, fontSize: 22, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
              On peut commander pour toi
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
              Contacte-nous et on trouve ce qu'il te faut.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
            <a href="mailto:leshotomangashop@gmail.com" style={{ background: C.rose, color: C.black, padding: "12px 24px", textDecoration: "none", fontSize: 12, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Email →
            </a>
            <a href="tel:0633870964" style={{ border: `1px solid rgba(255,255,255,0.3)`, color: C.blanc, padding: "12px 24px", textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Appeler
            </a>
          </div>
        </motion.div>

        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { icon: "🚚", title: "Livraison ou retrait", desc: "Retrait gratuit en boutique — 23 rue Georges Clémenceau" },
            { icon: "🔒", title: "Paiement sécurisé", desc: "CB, espèces en boutique, virement" },
            { icon: "↩️", title: "Retours sous 14j", desc: "Produit défectueux ? On s'en occupe." },
          ].map((item) => (
            <div key={item.title} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px 20px" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: C.blanc, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ color: C.gris, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px", marginTop: 80, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: "0.05em" }}>THE SHOTO<span style={{ color: C.rose }}>.</span></span>
        <span style={{ color: C.gris, fontSize: 12 }}>23 rue Georges Clémenceau, 11000 Carcassonne · leshotomangashop@gmail.com · 06 33 87 09 64</span>
        <span style={{ color: "#333", fontSize: 11 }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}