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
  grisMid: "#1A1A1A",
  border: "#222222",
  success: "#4FD080",
  warning: "#F0C040",
  error: "#FF4444",
};

const POINTS_BON = 270;
const VALEUR_BON = 10;

const STATUT_LABELS: Record<string, { label: string; color: string }> = {
  en_attente:     { label: "En attente",      color: C.warning },
  confirmee:      { label: "Confirmée",        color: C.rose },
  en_preparation: { label: "En préparation",   color: "#5B8EFF" },
  prete:          { label: "Prête à retirer",  color: C.success },
  recuperee:      { label: "Récupérée",        color: "#555" },
  annulee:        { label: "Annulée",          color: C.error },
};

interface ClientData {
  id: number;
  code: string;
  nomPrenom: string;
  points: string;
  bonus: string;
  tel: string | null;
  email: string | null;
  achats: string | null;
  createdAt: string;
}

interface CommandeLigne {
  produit: string;
  modele: string | null;
  quantite: number;
  prix: string;
  noteClient: string | null;
}

interface Commande {
  id: number;
  produit: string;
  modele: string | null;
  categorie: string;
  quantite: number;
  total: string;
  statut: string;
  noteGlobale: string | null;
  lienPaiement: string | null;
  createdAt: string;
  lignes: CommandeLigne[];
}

function Badge({ statut }: { statut: string }) {
  const s = STATUT_LABELS[statut] ?? { label: statut, color: C.gris };
  return (
    <span style={{ background: `${s.color}18`, border: `1px solid ${s.color}50`, color: s.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

export default function ComptePage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"infos" | "commandes" | "fidelite">("infos");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(async (r) => {
        if (!r.ok) { router.replace("/login"); return; }
        const d = await r.json();
        setClient(d.client);
        setIsAdmin(d.isAdmin);
      }),
      fetch("/api/commandes").then(async (r) => {
        if (r.ok) { const d = await r.json(); setCommandes(d.commandes ?? []); }
      }),
    ]).catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const copyCode = () => {
    if (!client) return;
    navigator.clipboard.writeText(client.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (n: string) => n.trim().split(" ").map((p) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const formatDateShort = (d: string) => new Date(d).toLocaleDateString("fr-FR");

  const pointsNum = parseInt(client?.points ?? "0", 10) || 0;
  const bonsDispos = Math.floor(pointsNum / POINTS_BON);
  const pointsRestants = pointsNum % POINTS_BON;
  const progressPct = (pointsRestants / POINTS_BON) * 100;
  const pointsToNext = POINTS_BON - pointsRestants;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ color: C.gris, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase" }}>Chargement…</motion.div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.blanc }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 18, color: C.blanc, letterSpacing: "0.05em" }}>
          THE SHOTO<span style={{ color: C.rose }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {isAdmin && (
            <a href="/admin" style={{ color: C.rose, textDecoration: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.rose}`, padding: "6px 14px" }}>Admin ⚙</a>
          )}
          {/* <a href="/panier" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>🛒 Panier</a> */}
          {/* <a href="/boutique/coques" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Boutique</a> */}
          <motion.button onClick={handleLogout} disabled={loggingOut} whileTap={{ scale: 0.97 }} style={{ background: "transparent", color: C.gris, border: `1px solid ${C.border}`, padding: "7px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            {loggingOut ? "…" : "Déconnexion"}
          </motion.button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 32px" }}>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${C.bordeaux}, ${C.rose})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: C.blanc, flexShrink: 0 }}>
            {getInitials(client.nomPrenom)}
          </div>
          <div>
            <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>— Mon compte</p>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 8px" }}>{client.nomPrenom}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "4px 12px", fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: C.rose }}>{client.code}</span>
              <motion.button onClick={copyCode} whileTap={{ scale: 0.95 }} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? C.success : C.gris, fontSize: 12, fontFamily: "inherit", padding: 0 }}>
                {copied ? "✓ Copié" : "Copier"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Points", value: pointsNum.toString(), color: C.rose },
            { label: `Bons ${VALEUR_BON}€`, value: bonsDispos.toString(), color: bonsDispos > 0 ? C.success : C.gris },
            { label: "Commandes", value: commandes.length.toString(), color: C.gris },
            { label: "Achats validés", value: client.achats ?? "0", color: C.gris },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: C.grisDark, border: `1px solid ${s.label === `Bons ${VALEUR_BON}€` && bonsDispos > 0 ? C.success : C.border}`, padding: "20px" }}>
              <p style={{ color: C.gris, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 900, fontSize: 28, margin: 0 }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <div>
              <p style={{ color: C.gris, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 2px" }}>Progression fidélité</p>
              <p style={{ color: "#444", fontSize: 11, margin: 0 }}>1€ dépensé = 1 point · {POINTS_BON} pts = {VALEUR_BON}€ de bon d'achat</p>
            </div>
            <p style={{ color: C.rose, fontSize: 12, fontWeight: 700, margin: 0 }}>
              {pointsRestants} / {POINTS_BON} pts · encore {pointsToNext} pts
            </p>
          </div>
          <div style={{ background: C.grisMid, borderRadius: 2, height: 6, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
          </div>
          {bonsDispos > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14, background: `${C.success}12`, border: `1px solid ${C.success}40`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: C.success, fontWeight: 700, fontSize: 13, margin: 0 }}>
                🎉 Tu as {bonsDispos} bon{bonsDispos > 1 ? "s" : ""} d'achat de {VALEUR_BON}€ disponible{bonsDispos > 1 ? "s" : ""} !
              </p>
              <p style={{ color: C.gris, fontSize: 12, margin: 0 }}>À utiliser en boutique · Présente ton code <strong style={{ color: C.rose }}>{client.code}</strong></p>
            </motion.div>
          )}
        </motion.div>

        <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: `1px solid ${C.border}` }}>
          {[
            { key: "infos", label: "Informations" },
            { key: "commandes", label: `Commandes (${commandes.length})` },
            { key: "fidelite", label: "Programme fidélité" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as "infos" | "commandes" | "fidelite")} style={{ background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? C.rose : "transparent"}`, color: activeTab === tab.key ? C.rose : C.gris, padding: "12px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: -1, transition: "color 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {activeTab === "infos" && (
            <motion.div key="infos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Mes infos</p>
                  {[
                    { label: "Code client", value: client.code },
                    ...(client.tel ? [{ label: "Téléphone", value: client.tel }] : []),
                    ...(client.email ? [{ label: "Email", value: client.email }] : []),
                    { label: "Membre depuis", value: formatDate(client.createdAt) },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ color: C.gris, fontSize: 13 }}>{row.label}</span>
                      <span style={{ color: C.blanc, fontSize: 13, fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Accès rapide</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      // { label: "🛒 Mon panier", href: "/panier" },
                      // { label: "Boutique Coques & Écrans", href: "/boutique/coques" },
                      // { label: "Boutique Goodies & Figurines", href: "/boutique/goodies" },
                      { label: "Retour accueil", href: "/" },
                    ].map((link) => (
                      <motion.a key={link.href} href={link.href} whileHover={{ x: 6 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", border: `1px solid ${C.border}`, textDecoration: "none", color: C.blanc, fontSize: 13, fontWeight: 600 }}>
                        {link.label} <span style={{ color: C.rose }}>→</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "commandes" && (
            <motion.div key="commandes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 28 }}>
              {commandes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                  <p style={{ color: C.gris, fontSize: 15, margin: "0 0 24px" }}>Aucune commande pour l'instant.</p>
                  <a href="/boutique/coques" style={{ display: "inline-block", background: C.bordeaux, color: C.blanc, textDecoration: "none", padding: "12px 28px", fontSize: 12, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Voir la boutique →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {commandes.map((cmd, i) => (
                    <motion.div key={cmd.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <p style={{ color: C.gris, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>Commande #{cmd.id} · {formatDateShort(cmd.createdAt)}</p>
                          <p style={{ color: C.blanc, fontWeight: 800, fontSize: 15, margin: 0 }}>
                            {cmd.lignes?.length > 0 ? `${cmd.lignes.length} article${cmd.lignes.length > 1 ? "s" : ""}` : "Commande"}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <Badge statut={cmd.statut} />
                          <span style={{ color: C.rose, fontWeight: 900, fontSize: 18 }}>{cmd.total}</span>
                        </div>
                      </div>
                      {cmd.lignes?.length > 0 && (
                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 10 }}>
                          {cmd.lignes.map((l, li) => (
                            <div key={li} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
                              <span style={{ color: C.gris }}>{l.produit}{l.modele ? ` (${l.modele})` : ""} ×{l.quantite}</span>
                              <span style={{ color: C.blanc, fontWeight: 600 }}>{l.prix}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {cmd.noteGlobale && <p style={{ color: C.gris, fontSize: 12, fontStyle: "italic", margin: "0 0 10px" }}>« {cmd.noteGlobale} »</p>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          {cmd.statut === "recuperee" && (
                            <span style={{ color: C.success, fontSize: 12, fontWeight: 600 }}>
                              ✓ +{Math.floor(parseFloat(cmd.total.replace(",", ".").replace("€", "").trim()))} pts crédités
                            </span>
                          )}
                        </div>
                        {cmd.statut === "en_attente" && cmd.lienPaiement && (
                          <a href={cmd.lienPaiement} target="_blank" rel="noopener noreferrer" style={{ background: C.bordeaux, color: C.blanc, textDecoration: "none", padding: "8px 18px", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                            Payer →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "fidelite" && (
            <motion.div key="fidelite" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "32px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 24px" }}>Ton solde</p>
                  <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <p style={{ color: C.rose, fontWeight: 900, fontSize: 56, margin: "0 0 4px", letterSpacing: "-0.04em" }}>{pointsNum}</p>
                    <p style={{ color: C.gris, fontSize: 13, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>points fidélité</p>
                  </div>
                  <div style={{ background: C.grisMid, borderRadius: 2, height: 8, overflow: "hidden", marginBottom: 10 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ color: "#444", fontSize: 11 }}>{pointsRestants} pts</span>
                    <span style={{ color: C.gris, fontSize: 11 }}>{POINTS_BON} pts = {VALEUR_BON}€</span>
                  </div>
                  <div style={{ background: C.grisMid, padding: "16px", textAlign: "center" }}>
                    <p style={{ color: C.gris, fontSize: 12, margin: "0 0 4px" }}>Prochain bon d'achat dans</p>
                    <p style={{ color: C.rose, fontWeight: 900, fontSize: 24, margin: 0 }}>{pointsToNext} pts</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {bonsDispos > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: `linear-gradient(135deg, ${C.bordeaux}88, ${C.rose}44)`, border: `1px solid ${C.rose}50`, padding: "24px" }}>
                      <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>🎉 Bon d'achat disponible</p>
                      <p style={{ color: C.blanc, fontWeight: 900, fontSize: 28, margin: "0 0 4px" }}>{bonsDispos} × {VALEUR_BON}€</p>
                      <p style={{ color: C.gris, fontSize: 13, margin: "0 0 12px" }}>Présente ton code en boutique pour l'utiliser.</p>
                      <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 14px", display: "inline-block" }}>
                        <span style={{ color: C.rose, fontWeight: 900, letterSpacing: "0.2em" }}>{client.code}</span>
                      </div>
                    </motion.div>
                  )}

                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>Comment ça marche</p>
                    {[
                      { icon: "🛒", text: "Tu achètes en boutique ou en ligne" },
                      { icon: "💰", text: "Tu gagnes 1 point par euro dépensé" },
                      { icon: "🎁", text: `${POINTS_BON} points = ${VALEUR_BON}€ de bon d'achat` },
                      { icon: "📱", text: "Présente ton code à la caisse pour cumuler" },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ color: C.gris, fontSize: 13, lineHeight: 1.5 }}>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>Utiliser le bon d'achat</p>
                    <p style={{ color: C.gris, fontSize: 13, lineHeight: 1.6, margin: "0 0 8px" }}>Option 1 : 1 manga (6,99€–8,99€) + 1 boisson</p>
                    <p style={{ color: C.gris, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Option 2 : 2 mangas (~4€ économisés)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
        <span style={{ fontWeight: 900, fontSize: 15 }}>THE SHOTO<span style={{ color: C.rose }}>.</span></span>
        <span style={{ color: "#333", fontSize: 11 }}>23 rue Georges Clémenceau · 11000 Carcassonne · leshotomangashop@gmail.com</span>
      </footer>
    </div>
  );
}