"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { COLORS, POINTS_BON, VALEUR_BON } from "@/constants";

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

const STATUT_OPTIONS = [
  { value: "en_attente",     label: "En attente",      color: C.warning },
  { value: "confirmee",      label: "Confirmée",        color: C.rose },
  { value: "en_preparation", label: "En préparation",   color: "#5B8EFF" },
  { value: "prete",          label: "Prête",            color: C.success },
  { value: "recuperee",      label: "Récupérée ✓",      color: "#4FD080" },
  { value: "annulee",        label: "Annulée",          color: C.error },
];

interface Client {
  id: number;
  code: string;
  nomPrenom: string;
  points: string | null;
  bonus: string | null;
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
  clientCode: string;
  clientNom: string;
  clientEmail: string | null;
  clientTel: string | null;
  total: string;
  statut: string;
  noteGlobale: string | null;
  createdAt: string;
  lignes: CommandeLigne[];
}

type Tab = "dashboard" | "clients" | "commandes" | "points";

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
      <p style={{ color: C.gris, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
      <p style={{ color, fontWeight: 900, fontSize: 30, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{sub}</p>}
    </motion.div>
  );
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [clients, setClients] = useState<Client[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [updatingStatut, setUpdatingStatut] = useState<number | null>(null);
  const [statutFeedback, setStatutFeedback] = useState<{ id: number; msg: string; pts?: number } | null>(null);
  const [pointsForm, setPointsForm] = useState({ clientId: "", operation: "ajouter", montant: "", raison: "" });
  const [pointsResult, setPointsResult] = useState<{ delta: string; nouveauTotal: number; code: string; bonDachatDisponibles: number } | null>(null);
  const [pointsError, setPointsError] = useState("");
  const [pointsLoading, setPointsLoading] = useState(false);
  const [statutFilter, setStatutFilter] = useState("tous");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cr, cmr] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/commandes/admin"),
      ]);
      if (cr.ok) { const d = await cr.json(); setClients(d.clients ?? []); }
      if (cmr.ok) { const d = await cmr.json(); setCommandes(d.commandes ?? []); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (!r.ok) { router.replace("/login"); return; }
      const d = await r.json();
      if (!d.isAdmin) { router.replace("/compte"); return; }
      fetchData();
    }).catch(() => router.replace("/login"));
  }, [router, fetchData]);

  const handleCreate = async () => {
    if (!form.nom.trim() || !form.prenom.trim()) { setFormError("Nom et prénom obligatoires."); return; }
    setCreating(true); setFormError(""); setNewCode(null);
    try {
      const r = await fetch("/api/clients/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setFormError(d.error ?? "Erreur"); setCreating(false); return; }
      setNewCode(d.code);
      setForm({ nom: "", prenom: "", tel: "", email: "" });
      fetchData();
    } catch { setFormError("Erreur serveur."); }
    finally { setCreating(false); }
  };

  const handleStatut = async (id: number, statut: string) => {
    setUpdatingStatut(id);
    setStatutFeedback(null);
    const r = await fetch("/api/commandes/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut }),
    });
    const data = await r.json();
    setCommandes((prev) => prev.map((c) => c.id === id ? { ...c, statut } : c));
    if (data.pointsCredites) {
      setStatutFeedback({ id, msg: `+${data.pointsCredites} pts crédités à ${data.commande?.clientNom ?? ""}`, pts: data.pointsCredites });
      fetchData();
    }
    setUpdatingStatut(null);
    setTimeout(() => setStatutFeedback(null), 4000);
  };

  const handlePoints = async () => {
    if (!pointsForm.clientId || !pointsForm.montant) { setPointsError("Sélectionne un client et un montant."); return; }
    setPointsLoading(true); setPointsError(""); setPointsResult(null);
    try {
      const r = await fetch("/api/clients/points", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: parseInt(pointsForm.clientId), operation: pointsForm.operation, montant: pointsForm.montant, raison: pointsForm.raison }),
      });
      const d = await r.json();
      if (!r.ok) { setPointsError(d.error ?? "Erreur"); setPointsLoading(false); return; }
      setPointsResult(d);
      setClients((prev) => prev.map((c) => c.id === parseInt(pointsForm.clientId) ? { ...c, points: d.nouveauTotal.toString() } : c));
      setPointsForm((p) => ({ ...p, montant: "", raison: "" }));
    } catch { setPointsError("Erreur serveur."); }
    finally { setPointsLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");
  const formatDateFull = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const getPts = (c: Client) => parseInt(c.points ?? "0") || 0;
  const totalPts = clients.reduce((a, c) => a + getPts(c), 0);
  const totalCA = commandes.filter((c) => c.statut === "recuperee").reduce((a, c) => a + parseFloat(c.total.replace(",", ".").replace("€", "").trim()), 0);

  const filteredClients = clients.filter((c) =>
    c.nomPrenom.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredCommandes = commandes
    .filter((c) => statutFilter === "tous" || c.statut === statutFilter)
    .filter((c) =>
      c.clientNom.toLowerCase().includes(search.toLowerCase()) ||
      c.clientCode.toLowerCase().includes(search.toLowerCase()) ||
      String(c.id).includes(search)
    );

  const TABS: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "clients", label: `Clients (${clients.length})` },
    { key: "commandes", label: `Commandes (${commandes.length})` },
    { key: "points", label: "Points fidélité" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.blanc }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 18, color: C.blanc, letterSpacing: "0.05em" }}>
          LE SHOTO<span style={{ color: C.rose }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="/compte" style={{ color: C.gris, textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Mon compte</a>
          <motion.button onClick={fetchData} whileTap={{ scale: 0.95 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, color: C.gris, padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase" }}>↻</motion.button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>

        <div className="max-md:hidden md:flex relative" style={{ gap: 0, marginBottom: 0, borderBottom: `1px solid ${C.border}` }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); setNewCode(null); setPointsResult(null); setStatutFilter("tous"); }} style={{ background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? C.rose : "transparent"}`, color: activeTab === tab.key ? C.rose : C.gris, padding: "12px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: -1, transition: "color 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-md:flex md:hidden" style={{ flexDirection: "column", gap: 12, marginBottom: 8, borderBottom: `1px solid ${C.border}`, backgroundColor: COLORS.deepInk, padding: 12, borderRadius: 6 }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); setNewCode(null); setPointsResult(null); setStatutFilter("tous"); }} style={{ background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? C.rose : "transparent"}`, color: activeTab === tab.key ? C.rose : C.gris, padding: "12px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: -1, transition: "color 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 32 }}>
              <div className="max-md:hidden md:grid relative" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }}>
                <StatCard label="Clients" value={clients.length} color={C.rose} />
                <StatCard label="Commandes totales" value={commandes.length} color="#5B8EFF" />
                <StatCard label="En attente" value={commandes.filter((c) => c.statut === "en_attente").length} color={C.warning} />
                <StatCard label="CA validé" value={`${totalCA.toFixed(2).replace(".", ",")}€`} color={C.success} sub="Commandes récupérées" />
              </div>
              <div className="max-md:grid md:hidden" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 40 }}>
                <StatCard label="Clients" value={clients.length} color={C.rose} />
                <StatCard label="Commandes totales" value={commandes.length} color="#5B8EFF" />
                <StatCard label="En attente" value={commandes.filter((c) => c.statut === "en_attente").length} color={C.warning} />
                <StatCard label="CA validé" value={`${totalCA.toFixed(2).replace(".", ",")}€`} color={C.success} sub="Commandes récupérées" />
              </div>

              <div className="max-md:hidden md:grid relative" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }}>
                <StatCard label="Points distribués" value={totalPts} color={C.rose} sub="Total cumulé" />
                <StatCard label="Bons actifs" value={clients.reduce((a, c) => a + Math.floor(getPts(c) / POINTS_BON), 0)} color={C.warning} sub={`${POINTS_BON} pts = ${VALEUR_BON}€`} />
                <StatCard label="Prêtes à retirer" value={commandes.filter((c) => c.statut === "prete").length} color={C.success} />
                <StatCard label="Annulées" value={commandes.filter((c) => c.statut === "annulee").length} color={C.error} />
              </div>
              <div className="max-md:grid md:hidden" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 40 }}>
                <StatCard label="Points distribués" value={totalPts} color={C.rose} sub="Total cumulé" />
                <StatCard label="Bons actifs" value={clients.reduce((a, c) => a + Math.floor(getPts(c) / POINTS_BON), 0)} color={C.warning} sub={`${POINTS_BON} pts = ${VALEUR_BON}€`} />
                <StatCard label="Prêtes à retirer" value={commandes.filter((c) => c.statut === "prete").length} color={C.success} />
                <StatCard label="Annulées" value={commandes.filter((c) => c.statut === "annulee").length} color={C.error} />
              </div>

              <div className="max-md:hidden md:grid relative" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>
                    Dernières commandes
                  </p>
                  {commandes.slice(0, 6).map((c) => {
                    const s = STATUT_OPTIONS.find((s) => s.value === c.statut);
                    return (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                        <div>
                          <p style={{ color: C.blanc, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{c.clientNom} <span style={{ color: C.gris, fontWeight: 400 }}>#{c.id}</span></p>
                          <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{formatDate(c.createdAt)}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: C.rose, fontWeight: 900, fontSize: 14, margin: "0 0 2px" }}>{c.total}</p>
                          <span style={{ background: `${s?.color ?? C.gris}20`, color: s?.color ?? C.gris, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px" }}>
                            {s?.label ?? c.statut}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setActiveTab("commandes")} style={{ marginTop: 14, background: "none", border: "none", color: C.rose, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, fontWeight: 700 }}>
                    Voir tout →
                  </button>
                </div>

                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>
                    Top fidélité
                  </p>
                  {[...clients]
                    .sort((a, b) => getPts(b) - getPts(a))
                    .slice(0, 8)
                    .map((c, i) => {
                      const pts = getPts(c);
                      const maxPts = getPts([...clients].sort((a, b) => getPts(b) - getPts(a))[0] ?? clients[0]);
                      const pct = maxPts > 0 ? (pts / maxPts) * 100 : 0;
                      return (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <span style={{ color: i < 3 ? C.rose : "#444", fontWeight: 900, fontSize: 11, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ color: C.blanc, fontSize: 12, fontWeight: 600 }}>{c.nomPrenom}</span>
                              <span style={{ color: C.rose, fontSize: 11, fontWeight: 700 }}>{pts} pts</span>
                            </div>
                            <div style={{ background: C.grisMid, borderRadius: 2, height: 3, overflow: "hidden" }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="max-md:grid md:hidden" style={{ gridTemplateColumns: "1fr", gap: 24 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>
                    Dernières commandes
                  </p>
                  {commandes.slice(0, 6).map((c) => {
                    const s = STATUT_OPTIONS.find((s) => s.value === c.statut);
                    return (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                        <div>
                          <p style={{ color: C.blanc, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{c.clientNom} <span style={{ color: C.gris, fontWeight: 400 }}>#{c.id}</span></p>
                          <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{formatDate(c.createdAt)}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: C.rose, fontWeight: 900, fontSize: 14, margin: "0 0 2px" }}>{c.total}</p>
                          <span style={{ background: `${s?.color ?? C.gris}20`, color: s?.color ?? C.gris, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px" }}>
                            {s?.label ?? c.statut}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setActiveTab("commandes")} style={{ marginTop: 14, background: "none", border: "none", color: C.rose, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, fontWeight: 700 }}>
                    Voir tout →
                  </button>
                </div>

                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>
                    Top fidélité
                  </p>
                  {[...clients]
                    .sort((a, b) => getPts(b) - getPts(a))
                    .slice(0, 8)
                    .map((c, i) => {
                      const pts = getPts(c);
                      const maxPts = getPts([...clients].sort((a, b) => getPts(b) - getPts(a))[0] ?? clients[0]);
                      const pct = maxPts > 0 ? (pts / maxPts) * 100 : 0;
                      return (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <span style={{ color: i < 3 ? C.rose : "#444", fontWeight: 900, fontSize: 11, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ color: C.blanc, fontSize: 12, fontWeight: 600 }}>{c.nomPrenom}</span>
                              <span style={{ color: C.rose, fontSize: 11, fontWeight: 700 }}>{pts} pts</span>
                            </div>
                            <div style={{ background: C.grisMid, borderRadius: 2, height: 3, overflow: "hidden" }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "clients" && (
            <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 32 }}>
              <div className="max-md:hidden md:grid relative" style={{ gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 36 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Créer un client</p>
                  <AnimatePresence>
                    {newCode && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, padding: "12px 16px", marginBottom: 16 }}>
                        <p style={{ color: C.success, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>✓ Client créé</p>
                        <p style={{ color: C.gris, fontSize: 12, margin: 0 }}>Code client : <strong style={{ color: C.blanc, letterSpacing: "0.15em", fontSize: 16 }}>{newCode}</strong></p>
                      </motion.div>
                    )}
                    {formError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `${C.error}15`, border: `1px solid ${C.error}40`, padding: "10px 14px", marginBottom: 12 }}>
                        <p style={{ color: C.error, fontSize: 12, margin: 0 }}>{formError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    {[{ key: "nom", label: "Nom *", ph: "Wailly" }, { key: "prenom", label: "Prénom *", ph: "Mylowann" }].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 5 }}>{f.label}</label>
                        <input type="text" value={form[f.key as keyof typeof form]} onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setFormError(""); setNewCode(null); }} placeholder={f.ph} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 11px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[{ key: "tel", label: "Téléphone", ph: "06 XX XX XX XX" }, { key: "email", label: "Email", ph: "client@mail.com" }].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 5 }}>{f.label}</label>
                        <input type="text" value={form[f.key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 11px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ background: C.grisMid, padding: "9px 13px", marginBottom: 14 }}>
                    <p style={{ color: C.gris, fontSize: 11, margin: 0 }}>Code auto : <strong style={{ color: C.blanc }}>initiale nom + initiale prénom + dizaine</strong> · Ex: <span style={{ color: C.rose }}>WM100</span></p>
                  </div>
                  <motion.button onClick={handleCreate} disabled={creating} whileTap={!creating ? { scale: 0.97 } : {}} style={{ width: "100%", background: creating ? C.grisMid : C.bordeaux, color: creating ? "#555" : C.blanc, border: "none", padding: "13px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: creating ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {creating ? "Création…" : "Créer le client →"}
                  </motion.button>
                </div>

                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Statistiques clients</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Total clients", value: clients.length, color: C.rose },
                      { label: "Avec email", value: clients.filter((c) => c.email).length, color: C.gris },
                      { label: "Avec téléphone", value: clients.filter((c) => c.tel).length, color: C.gris },
                      { label: "Bons disponibles", value: clients.reduce((a, c) => a + Math.floor(getPts(c) / POINTS_BON), 0), color: C.warning },
                    ].map((s) => (
                      <div key={s.label} style={{ background: C.grisMid, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                        <p style={{ color: C.gris, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>{s.label}</p>
                        <p style={{ color: s.color, fontWeight: 900, fontSize: 24, margin: 0 }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div className="max-md:grid md:hidden" style={{ gridTemplateColumns: "1fr", gap: 28, marginBottom: 36 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Créer un client</p>
                  <AnimatePresence>
                    {newCode && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, padding: "12px 16px", marginBottom: 16 }}>
                        <p style={{ color: C.success, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>✓ Client créé</p>
                        <p style={{ color: C.gris, fontSize: 12, margin: 0 }}>Code client : <strong style={{ color: C.blanc, letterSpacing: "0.15em", fontSize: 16 }}>{newCode}</strong></p>
                      </motion.div>
                    )}
                    {formError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `${C.error}15`, border: `1px solid ${C.error}40`, padding: "10px 14px", marginBottom: 12 }}>
                        <p style={{ color: C.error, fontSize: 12, margin: 0 }}>{formError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    {[{ key: "nom", label: "Nom *", ph: "Wailly" }, { key: "prenom", label: "Prénom *", ph: "Mylowann" }].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 5 }}>{f.label}</label>
                        <input type="text" value={form[f.key as keyof typeof form]} onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setFormError(""); setNewCode(null); }} placeholder={f.ph} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 11px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[{ key: "tel", label: "Téléphone", ph: "06 XX XX XX XX" }, { key: "email", label: "Email", ph: "client@mail.com" }].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 5 }}>{f.label}</label>
                        <input type="text" value={form[f.key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 11px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ background: C.grisMid, padding: "9px 13px", marginBottom: 14 }}>
                    <p style={{ color: C.gris, fontSize: 11, margin: 0 }}>Code auto : <strong style={{ color: C.blanc }}>initiale nom + initiale prénom + dizaine</strong> · Ex: <span style={{ color: C.rose }}>WM100</span></p>
                  </div>
                  <motion.button onClick={handleCreate} disabled={creating} whileTap={!creating ? { scale: 0.97 } : {}} style={{ width: "100%", background: creating ? C.grisMid : C.bordeaux, color: creating ? "#555" : C.blanc, border: "none", padding: "13px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: creating ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {creating ? "Création…" : "Créer le client →"}
                  </motion.button>
                </div>

                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 20px" }}>Statistiques clients</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Total clients", value: clients.length, color: C.rose },
                      { label: "Avec email", value: clients.filter((c) => c.email).length, color: C.gris },
                      { label: "Avec téléphone", value: clients.filter((c) => c.tel).length, color: C.gris },
                      { label: "Bons disponibles", value: clients.reduce((a, c) => a + Math.floor(getPts(c) / POINTS_BON), 0), color: C.warning },
                    ].map((s) => (
                      <div key={s.label} style={{ background: C.grisMid, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                        <p style={{ color: C.gris, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>{s.label}</p>
                        <p style={{ color: s.color, fontWeight: 900, fontSize: 24, margin: 0 }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                  Liste clients ({filteredClients.length})
                </p>
                <input type="text" placeholder="Nom, code, email…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: C.grisDark, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", width: 260 }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
              </div>

              <div style={{ border: `1px solid ${C.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 18px", background: C.grisMid }}>
                  {["Nom", "Téléphone", "Code", "Depuis"].map((h) => (
                    <span key={h} style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gris, fontWeight: 700 }}>{h}</span>
                  ))}
                </div>
                {filteredClients.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: C.gris, fontSize: 13 }}>Aucun client trouvé.</div>
                ) : filteredClients.map((c, i) => {
                  const pts = getPts(c);
                  const bons = Math.floor(pts / POINTS_BON);
                  return (
                    <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 18px", borderTop: `1px solid ${C.border}`, alignItems: "center", cursor: "default" }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.grisDark; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 2px" }}>{c.nomPrenom}</p>
                        {c.email && <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{c.email}</p>}
                      </div>
                      <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 12 }}>{c.tel || "Non renseigné"}</span>
                      <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: 12 }}>{c.code}</span>
                      <span style={{ color: COLORS.accent, fontSize: 11 }}>{formatDate(c.createdAt)}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "commandes" && (
            <motion.div key="commandes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 32 }}>

              <AnimatePresence>
                {statutFeedback && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, padding: "12px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: C.success, fontSize: 18 }}>✓</span>
                    <p style={{ color: C.success, fontWeight: 700, fontSize: 13, margin: 0 }}>{statutFeedback.msg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[{ value: "tous", label: "Toutes" }, ...STATUT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))].map((f) => (
                    <button key={f.value} onClick={() => setStatutFilter(f.value)} style={{ background: statutFilter === f.value ? C.bordeaux : C.grisDark, border: `1px solid ${statutFilter === f.value ? C.bordeaux : C.border}`, color: statutFilter === f.value ? C.blanc : C.gris, padding: "7px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Nom, code, #ID…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: C.grisDark, border: `1px solid ${C.border}`, color: C.blanc, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", width: 220 }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
              </div>

              {filteredCommandes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: C.gris, fontSize: 13 }}>Aucune commande.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredCommandes.map((cmd, i) => {
                    const statOpt = STATUT_OPTIONS.find((s) => s.value === cmd.statut);
                    const ptsGagnes = cmd.statut === "recuperee" ? Math.floor(parseFloat(cmd.total.replace(",", ".").replace("€", "").trim())) : 0;
                    return (
                      <motion.div key={cmd.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ background: C.grisDark, border: `1px solid ${cmd.statut === "en_attente" ? C.warning + "40" : C.border}`, padding: "18px 22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                          <div>
                            <p style={{ color: C.gris, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 3px" }}>
                              #{cmd.id} · {formatDateFull(cmd.createdAt)}
                            </p>
                            <p style={{ color: C.blanc, fontWeight: 800, fontSize: 15, margin: "0 0 2px" }}>
                              {cmd.clientNom}
                              <span style={{ color: C.rose, fontWeight: 700, fontSize: 12, marginLeft: 8 }}>({cmd.clientCode})</span>
                            </p>
                            <div style={{ display: "flex", gap: 12 }}>
                              {cmd.clientEmail && <span style={{ color: "#444", fontSize: 11 }}>{cmd.clientEmail}</span>}
                              {cmd.clientTel && <span style={{ color: "#444", fontSize: 11 }}>{cmd.clientTel}</span>}
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                            <span style={{ color: C.rose, fontWeight: 900, fontSize: 20 }}>{cmd.total}</span>
                            <select
                              value={cmd.statut}
                              onChange={(e) => handleStatut(cmd.id, e.target.value)}
                              disabled={updatingStatut === cmd.id}
                              style={{ background: `${statOpt?.color ?? C.gris}18`, border: `1px solid ${statOpt?.color ?? C.border}50`, color: statOpt?.color ?? C.blanc, padding: "7px 12px", fontSize: 11, fontFamily: "inherit", outline: "none", cursor: "pointer", fontWeight: 700, letterSpacing: "0.05em" }}
                            >
                              {STATUT_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value} style={{ background: C.grisDark, color: C.blanc }}>{s.label}</option>
                              ))}
                            </select>
                            {updatingStatut === cmd.id && (
                              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: C.gris, fontSize: 11 }}>Mise à jour…</motion.span>
                            )}
                          </div>
                        </div>

                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                          {cmd.lignes?.map((l, li) => (
                            <div key={li} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
                              <span style={{ color: C.gris }}>{l.produit}{l.modele ? ` (${l.modele})` : ""} ×{l.quantite}{l.noteClient ? ` — ${l.noteClient}` : ""}</span>
                              <span style={{ color: C.blanc, fontWeight: 600 }}>{l.prix}</span>
                            </div>
                          ))}
                          {cmd.noteGlobale && (
                            <p style={{ color: C.gris, fontSize: 12, fontStyle: "italic", margin: "6px 0 0" }}>« {cmd.noteGlobale} »</p>
                          )}
                        </div>

                        {ptsGagnes > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: C.success, fontSize: 12, fontWeight: 700 }}>✓ +{ptsGagnes} pts crédités</span>
                            <span style={{ color: "#444", fontSize: 11 }}>— 1pt/€ dépensé</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "points" && (
            <motion.div key="points" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 32 }}>
              <div className="max-md:hidden md:grid relative" style={{ gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Ajout / retrait manuel</p>
                  <p style={{ color: "#444", fontSize: 12, margin: "0 0 20px" }}>
                    Les points sont aussi crédités automatiquement quand une commande passe à <strong style={{ color: C.success }}>Récupérée</strong>.
                  </p>
                  <AnimatePresence>
                    {pointsResult && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, padding: "14px 18px", marginBottom: 20 }}>
                        <p style={{ color: C.success, fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>✓ Mis à jour — {pointsResult.code}</p>
                        <p style={{ color: C.gris, fontSize: 12, margin: "0 0 2px" }}>
                          <span style={{ color: pointsResult.delta.startsWith("+") ? C.success : C.error, fontWeight: 700 }}>{pointsResult.delta} pts</span>
                          {" · "}Nouveau total : <strong style={{ color: C.blanc }}>{pointsResult.nouveauTotal} pts</strong>
                        </p>
                        {pointsResult.bonDachatDisponibles > 0 && (
                          <p style={{ color: C.warning, fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>
                            🎉 {pointsResult.bonDachatDisponibles} bon{pointsResult.bonDachatDisponibles > 1 ? "s" : ""} d'achat disponible{pointsResult.bonDachatDisponibles > 1 ? "s" : ""} ({VALEUR_BON}€)
                          </p>
                        )}
                      </motion.div>
                    )}
                    {pointsError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `${C.error}15`, border: `1px solid ${C.error}40`, padding: "10px 14px", marginBottom: 16 }}>
                        <p style={{ color: C.error, fontSize: 12, margin: 0 }}>{pointsError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Client</label>
                    <select value={pointsForm.clientId} onChange={(e) => { setPointsForm((p) => ({ ...p, clientId: e.target.value })); setPointsResult(null); }} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: pointsForm.clientId ? C.blanc : C.gris, padding: "11px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}>
                      <option value="">Sélectionner un client…</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: C.grisDark }}>
                          {c.nomPrenom} ({c.code}) — {getPts(c)} pts
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Opération</label>
                      <div style={{ display: "flex" }}>
                        {[{ v: "ajouter", l: "+ Ajouter", col: C.success }, { v: "retirer", l: "− Retirer", col: C.error }].map((op) => (
                          <button key={op.v} onClick={() => setPointsForm((p) => ({ ...p, operation: op.v }))} style={{ flex: 1, background: pointsForm.operation === op.v ? `${op.col}22` : C.grisMid, border: `1px solid ${pointsForm.operation === op.v ? op.col : C.border}`, color: pointsForm.operation === op.v ? op.col : C.gris, padding: "10px 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                            {op.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Montant (pts)</label>
                      <input type="number" min="1" value={pointsForm.montant} onChange={(e) => setPointsForm((p) => ({ ...p, montant: e.target.value }))} placeholder="Ex: 50" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 16, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Raison (optionnel)</label>
                    <input type="text" value={pointsForm.raison} onChange={(e) => setPointsForm((p) => ({ ...p, raison: e.target.value }))} placeholder="Achat spécial, event, correction…" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>

                  {pointsForm.clientId && pointsForm.montant && (() => {
                    const client = clients.find((c) => c.id === parseInt(pointsForm.clientId));
                    const current = getPts(client!);
                    const delta = parseInt(pointsForm.montant) || 0;
                    const next = pointsForm.operation === "ajouter" ? current + delta : Math.max(0, current - delta);
                    const bonsAvant = Math.floor(current / POINTS_BON);
                    const bonsApres = Math.floor(next / POINTS_BON);
                    return (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: C.grisMid, padding: "12px 16px", marginBottom: 16 }}>
                        <p style={{ color: C.gris, fontSize: 12, margin: "0 0 4px" }}>
                          <strong style={{ color: C.blanc }}>{client?.nomPrenom}</strong> : {current} pts → <strong style={{ color: pointsForm.operation === "ajouter" ? C.success : C.error }}>{next} pts</strong>
                          <span style={{ color: pointsForm.operation === "ajouter" ? C.success : C.error }}> ({pointsForm.operation === "ajouter" ? "+" : "-"}{delta})</span>
                        </p>
                        {bonsApres > bonsAvant && (
                          <p style={{ color: C.warning, fontSize: 12, fontWeight: 700, margin: 0 }}>
                            🎉 Un nouveau bon de {VALEUR_BON}€ sera disponible !
                          </p>
                        )}
                      </motion.div>
                    );
                  })()}

                  <motion.button onClick={handlePoints} disabled={pointsLoading || !pointsForm.clientId || !pointsForm.montant} whileTap={!pointsLoading ? { scale: 0.97 } : {}} style={{ width: "100%", background: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? C.grisMid : pointsForm.operation === "ajouter" ? C.bordeaux : "#3a0000", color: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "#555" : C.blanc, border: "none", padding: "14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {pointsLoading ? "Mise à jour…" : pointsForm.operation === "ajouter" ? `+ Ajouter ${pointsForm.montant || "…"} pts →` : `− Retirer ${pointsForm.montant || "…"} pts →`}
                  </motion.button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>Règle du programme</p>
                    {[
                      { icon: "💰", text: `1€ dépensé = 1 point fidélité` },
                      { icon: "🎁", text: `${POINTS_BON} points = ${VALEUR_BON}€ de bon d'achat` },
                      { icon: "✓", text: "Points crédités auto au statut «Récupérée»" },
                      { icon: "📱", text: "Client présente son code à la caisse" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        <span style={{ color: C.gris, fontSize: 13 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>Classement fidélité</p>
                    {[...clients]
                      .sort((a, b) => getPts(b) - getPts(a))
                      .slice(0, 8)
                      .map((c, i) => {
                        const pts = getPts(c);
                        const maxPts = Math.max(...clients.map((cl) => getPts(cl)), 1);
                        const pct = (pts / maxPts) * 100;
                        const bons = Math.floor(pts / POINTS_BON);
                        return (
                          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <span style={{ color: i < 3 ? C.rose : "#444", fontWeight: 900, fontSize: 11, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                <span style={{ color: C.blanc, fontSize: 12, fontWeight: 600 }}>{c.nomPrenom} <span style={{ color: C.rose, fontWeight: 700 }}>({c.code})</span></span>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  {bons > 0 && <span style={{ color: C.warning, fontSize: 10, fontWeight: 700 }}>{bons}×{VALEUR_BON}€</span>}
                                  <span style={{ color: C.rose, fontSize: 11, fontWeight: 700 }}>{pts} pts</span>
                                </div>
                              </div>
                              <div style={{ background: C.grisMid, borderRadius: 2, height: 4, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>


              <div className="max-md:grid md:hidden" style={{ gridTemplateColumns: "1fr", gap: 28 }}>
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Ajout / retrait manuel</p>
                  <p style={{ color: "#444", fontSize: 12, margin: "0 0 20px" }}>
                    Les points sont aussi crédités automatiquement quand une commande passe à <strong style={{ color: C.success }}>Récupérée</strong>.
                  </p>
                  <AnimatePresence>
                    {pointsResult && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, padding: "14px 18px", marginBottom: 20 }}>
                        <p style={{ color: C.success, fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>✓ Mis à jour — {pointsResult.code}</p>
                        <p style={{ color: C.gris, fontSize: 12, margin: "0 0 2px" }}>
                          <span style={{ color: pointsResult.delta.startsWith("+") ? C.success : C.error, fontWeight: 700 }}>{pointsResult.delta} pts</span>
                          {" · "}Nouveau total : <strong style={{ color: C.blanc }}>{pointsResult.nouveauTotal} pts</strong>
                        </p>
                        {pointsResult.bonDachatDisponibles > 0 && (
                          <p style={{ color: C.warning, fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>
                            🎉 {pointsResult.bonDachatDisponibles} bon{pointsResult.bonDachatDisponibles > 1 ? "s" : ""} d'achat disponible{pointsResult.bonDachatDisponibles > 1 ? "s" : ""} ({VALEUR_BON}€)
                          </p>
                        )}
                      </motion.div>
                    )}
                    {pointsError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: `${C.error}15`, border: `1px solid ${C.error}40`, padding: "10px 14px", marginBottom: 16 }}>
                        <p style={{ color: C.error, fontSize: 12, margin: 0 }}>{pointsError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Client</label>
                    <select value={pointsForm.clientId} onChange={(e) => { setPointsForm((p) => ({ ...p, clientId: e.target.value })); setPointsResult(null); }} style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: pointsForm.clientId ? C.blanc : C.gris, padding: "11px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}>
                      <option value="">Sélectionner un client…</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: C.grisDark }}>
                          {c.nomPrenom} ({c.code}) — {getPts(c)} pts
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Opération</label>
                      <div style={{ display: "flex" }}>
                        {[{ v: "ajouter", l: "+ Ajouter", col: C.success }, { v: "retirer", l: "− Retirer", col: C.error }].map((op) => (
                          <button key={op.v} onClick={() => setPointsForm((p) => ({ ...p, operation: op.v }))} style={{ flex: 1, background: pointsForm.operation === op.v ? `${op.col}22` : C.grisMid, border: `1px solid ${pointsForm.operation === op.v ? op.col : C.border}`, color: pointsForm.operation === op.v ? op.col : C.gris, padding: "10px 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                            {op.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Montant (pts)</label>
                      <input type="number" min="1" value={pointsForm.montant} onChange={(e) => setPointsForm((p) => ({ ...p, montant: e.target.value }))} placeholder="Ex: 50" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 16, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Raison (optionnel)</label>
                    <input type="text" value={pointsForm.raison} onChange={(e) => setPointsForm((p) => ({ ...p, raison: e.target.value }))} placeholder="Achat spécial, event, correction…" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>

                  {pointsForm.clientId && pointsForm.montant && (() => {
                    const client = clients.find((c) => c.id === parseInt(pointsForm.clientId));
                    const current = getPts(client!);
                    const delta = parseInt(pointsForm.montant) || 0;
                    const next = pointsForm.operation === "ajouter" ? current + delta : Math.max(0, current - delta);
                    const bonsAvant = Math.floor(current / POINTS_BON);
                    const bonsApres = Math.floor(next / POINTS_BON);
                    return (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: C.grisMid, padding: "12px 16px", marginBottom: 16 }}>
                        <p style={{ color: C.gris, fontSize: 12, margin: "0 0 4px" }}>
                          <strong style={{ color: C.blanc }}>{client?.nomPrenom}</strong> : {current} pts → <strong style={{ color: pointsForm.operation === "ajouter" ? C.success : C.error }}>{next} pts</strong>
                          <span style={{ color: pointsForm.operation === "ajouter" ? C.success : C.error }}> ({pointsForm.operation === "ajouter" ? "+" : "-"}{delta})</span>
                        </p>
                        {bonsApres > bonsAvant && (
                          <p style={{ color: C.warning, fontSize: 12, fontWeight: 700, margin: 0 }}>
                            🎉 Un nouveau bon de {VALEUR_BON}€ sera disponible !
                          </p>
                        )}
                      </motion.div>
                    );
                  })()}

                  <motion.button onClick={handlePoints} disabled={pointsLoading || !pointsForm.clientId || !pointsForm.montant} whileTap={!pointsLoading ? { scale: 0.97 } : {}} style={{ width: "100%", background: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? C.grisMid : pointsForm.operation === "ajouter" ? C.bordeaux : "#3a0000", color: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "#555" : C.blanc, border: "none", padding: "14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {pointsLoading ? "Mise à jour…" : pointsForm.operation === "ajouter" ? `+ Ajouter ${pointsForm.montant || "…"} pts →` : `− Retirer ${pointsForm.montant || "…"} pts →`}
                  </motion.button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>Règle du programme</p>
                    {[
                      { icon: "💰", text: `1€ dépensé = 1 point fidélité` },
                      { icon: "🎁", text: `${POINTS_BON} points = ${VALEUR_BON}€ de bon d'achat` },
                      { icon: "✓", text: "Points crédités auto au statut «Récupérée»" },
                      { icon: "📱", text: "Client présente son code à la caisse" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        <span style={{ color: C.gris, fontSize: 13 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "24px" }}>
                    <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 16px" }}>Classement fidélité</p>
                    {[...clients]
                      .sort((a, b) => getPts(b) - getPts(a))
                      .slice(0, 8)
                      .map((c, i) => {
                        const pts = getPts(c);
                        const maxPts = Math.max(...clients.map((cl) => getPts(cl)), 1);
                        const pct = (pts / maxPts) * 100;
                        const bons = Math.floor(pts / POINTS_BON);
                        return (
                          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <span style={{ color: i < 3 ? C.rose : "#444", fontWeight: 900, fontSize: 11, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                <span style={{ color: C.blanc, fontSize: 12, fontWeight: 600 }}>{c.nomPrenom} <span style={{ color: C.rose, fontWeight: 700 }}>({c.code})</span></span>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  {bons > 0 && <span style={{ color: C.warning, fontSize: 10, fontWeight: 700 }}>{bons}×{VALEUR_BON}€</span>}
                                  <span style={{ color: C.rose, fontSize: 11, fontWeight: 700 }}>{pts} pts</span>
                                </div>
                              </div>
                              <div style={{ background: C.grisMid, borderRadius: 2, height: 4, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} style={{ height: "100%", background: `linear-gradient(90deg, ${C.bordeaux}, ${C.rose})` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
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