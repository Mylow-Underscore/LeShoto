"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { COLORS, POINTS_BON, VALEUR_BON } from "@/constants";
import { get } from "http";

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
  points: number | null;
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

type Tab = "dashboard" | "clients" | "commandes en ligne" | "commandes" | "points";

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
      <p style={{ color: C.gris, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
      <p style={{ color, fontWeight: 900, fontSize: 30, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{sub}</p>}
    </motion.div>
  );
}

export const Commande = () => {
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
  const [bonsForm, setBonsForm] = useState({ clientId: "", operation: "ajouter", montant: "", raison: "" });
  const [bonsResult, setBonsResult] = useState<{ delta: string; nouveauTotal: number; code: string; bonDachatDisponibles: number } | null>(null);
  const [bonsError, setBonsError] = useState("");
  const [bonsLoading, setBonsLoading] = useState(false);
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

  const handlebnosetpoints = async () => {
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

    if (!bonsForm.clientId || !bonsForm.montant) { setBonsError("Sélectionne un client et un montant."); return; }
    setBonsLoading(true); setBonsError(""); setBonsResult(null);
    try {
      const r = await fetch("/api/clients/bons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: parseInt(bonsForm.clientId), operation: bonsForm.operation, montant: bonsForm.montant, raison: bonsForm.raison }),
      });
      const d = await r.json();
      if (!r.ok) { setBonsError(d.error ?? "Erreur"); setBonsLoading(false); return; }
      setBonsResult(d);
      setClients((prev) => prev.map((c) => c.id === parseInt(bonsForm.clientId) ? { ...c, points: d.nouveauTotal.toString() } : c));
      setBonsForm((p) => ({ ...p, montant: "", raison: "" }));
    } catch { setBonsError("Erreur serveur."); }
    finally { setBonsLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");
  const formatDateFull = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const getPts = (c: Client) => c.points || 0;
  const getClient = (id: number) => clients.find((c) => c.id === id);
  const totalPts = clients.reduce((a, c) => a + getPts(c), 0);
  const totalCA = commandes.filter((c) => c.statut === "recuperee").reduce((a, c) => a + parseFloat(c.total.replace(",", ".").replace("€", "").trim()), 0);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    if (clientSearch) {
      const results = clients.filter((c) =>
        c.nomPrenom.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.id === parseInt(clientSearch) ||
        c.code.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(clientSearch.toLowerCase())
      );
      
      setFilteredClients(results);
    } else {
      // Réinitialiser la liste de résultats si la recherche est vide
      setFilteredClients([]);
    }
  }, [clientSearch]);

  
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
    { key: "commandes en ligne", label: `commandes en ligne (${commandes.length})` },
    { key: "commandes", label: `Commandes (${commandes.length})` },
    { key: "points", label: "Points fidélité" },
  ];

  return (
    <>
            <motion.div key="Commandes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 32 }}>
              <div className="max-md:hidden md:grid relative">
                <div style={{ background: C.grisDark, border: `1px solid ${C.border}`, padding: "28px" }}>
                  <p style={{ color: C.rose, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Ajout Commande en Réel</p>
                  <p style={{ color: "#444", fontSize: 12, margin: "0 0 20px" }}>
                    Les points sont aussi crédités automatiquement quand une commande est passée.
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


                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 14 }}>
                    <div className="py-6">
                      {/* Barre de recherche clients */}
                      <div style={{ marginBottom: '1.75rem' }}>
                        <label
                          style={{
                            fontSize: '0.625rem',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: C.gris,
                            display: 'block',
                            marginBottom: '0.5rem'
                          }}
                        >
                          Client
                        </label>
                        
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Rechercher par code ou nom..."
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            onFocus={(e) => {
                              if (selectedClientId !== null && e.currentTarget.style.borderColor === C.border) {
                                e.currentTarget.style.borderColor = C.rose;
                              }
                            }}
                            onBlur={(e) => {
                              if (selectedClientId !== null) return;
                              e.currentTarget.style.borderColor = C.border;
                            }}
                            style={{
                              width: '100%',
                              background: C.grisMid,
                              border: `2px solid ${C.border}`, 
                              borderRadius: '8px', 
                              color: C.blanc,
                              padding: '14px',
                              fontSize: '1rem',
                              fontFamily: '"Inter", sans-serif',
                              transition: 'border-color 0.3s, background-color 0.3s'
                            }}
                          />
                          
                          {/* Afficher la liste de clients suggérés - limite à 3 résultats */}
                          {clientSearch && filteredClients.length > 0 && (
                            <div className="absolute transition-all duration-200 ease-out top-full left-0 right-0 rounded-b shadow-lg"
                              style={{
                                background: COLORS.deepInk,
                                borderLeft: `4px solid ${selectedClientId ? C.rose : 'transparent'}`,
                                zIndex: 1000
                              }}
                            >
                              {/* Limitation à maximum 3 résultats */}
                              {filteredClients.slice(0, 3).map(client => (
                                <div 
                                  key={client.id} 
                                  onClick={() => {
                                    setSelectedClientId(client.id);
                                    setClientSearch(client.code || "");
                                  }}
                                  style={{
                                    borderBottom: `1px solid ${C.border}`,
                                    transition: 'background-color 0.2s'
                                  }}
                                >
                                  <div className="flex items-center justify-between px-4 py-3">
                                    <p className="font-medium">{client.nomPrenom}</p>
                                    
                                    {client.points && (
                                      <span style={{ color: COLORS.accent, fontSize: '0.75rem', opacity: 0.8 }}>
                                        ({Math.floor(client.points / POINTS_BON)} bons)
                                      </span>
                                    )}

                                    {client.points && (
                                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                        ({client.points} pts)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              
                              {/* Message indiquant qu'il y a plus de résultats si nécessaire */}
                              {filteredClients.length > 3 && (
                                <p className="px-4 py-2 text-gray-500" style={{ cursor: 'pointer' }} onClick={() => setClientSearch(clientSearch)}>
                                  Afficher tous les résultats ({filteredClients.length - 3} restants)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                    
                    </div>
                      <div style={{ marginBottom: '1.75rem' }}>
                        <div className="relative">
                          <div>
                            <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Utilisation de bon</label>
                            <input type="number" min="0" value={bonsForm.montant} onChange={(e) => setBonsForm((p) => ({ ...p, montant: e.target.value }))} placeholder="Ex: 1" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 16, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}>Montant de la Commande (€)</label>
                            <input type="number" min="1" value={pointsForm.montant} onChange={(e) => setPointsForm((p) => ({ ...p, montant: e.target.value }))} placeholder="Ex: 10€" style={{ width: "100%", background: C.grisMid, border: `1px solid ${C.border}`, color: C.blanc, padding: "10px 12px", fontSize: 16, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.rose; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                          </div>
                        </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gris, display: "block", marginBottom: 7 }}><strong style={{ color: COLORS.white }}>Détail de la Commannde</strong></label>
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
                      <motion.div className="z-100" initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} style={{ background: COLORS.deepInk, padding: "12px 16px", marginBottom: 16 }}>
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

                  {bonsForm.clientId && bonsForm.montant && (() => {
                    const client = clients.find((c) => c.id === parseInt(bonsForm.clientId));
                    const current = getPts(client!);
                    const delta = parseInt(bonsForm.montant) || 0;

                    const next = bonsForm.operation === "ajouter" ? current + delta : Math.max(0, current - delta);
                    const bonsAvant = Math.floor(current / POINTS_BON);
                    const bonsApres = Math.floor(next / POINTS_BON);
                    return (
                      <motion.div className="z-100" initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} style={{ background: COLORS.deepInk, padding: "12px 16px", marginBottom: 16 }}>
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

                  
                  <motion.button onClick={handlebnosetpoints} disabled={ !pointsForm.clientId || !pointsForm.montant} whileTap={!pointsLoading ? { scale: 0.97 } : {}} style={{ width: "100%", background: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? C.grisMid : pointsForm.operation === "ajouter" ? C.bordeaux : "#3a0000", color: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "#555" : C.blanc, border: "none", padding: "14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {pointsLoading ? "Mise à jour…" : pointsForm.operation === "ajouter" ? `+ Ajouter ${pointsForm.montant || "…"} pts →` : `− Retirer ${pointsForm.montant || "…"} pts →`}
                    {bonsLoading ? "Mise à jour…" : bonsForm.operation === "ajouter" ? `− Retirer ${bonsForm.montant || "…"} pts →` : `+ Ajouter ${bonsForm.montant || "…"} pts →`}
                  </motion.button>
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

                  <motion.button onClick={handlebnosetpoints} disabled={pointsLoading || !pointsForm.clientId || !pointsForm.montant} whileTap={!pointsLoading ? { scale: 0.97 } : {}} style={{ width: "100%", background: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? C.grisMid : pointsForm.operation === "ajouter" ? C.bordeaux : "#3a0000", color: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "#555" : C.blanc, border: "none", padding: "14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: pointsLoading || !pointsForm.clientId || !pointsForm.montant ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {pointsLoading ? "Mise à jour…" : pointsForm.operation === "ajouter" ? `+ Ajouter ${pointsForm.montant || "…"} pts →` : `− Retirer ${pointsForm.montant || "…"} pts →`}
                  </motion.button>
                </div>
              </div>
            </motion.div>
    </>
  );
}