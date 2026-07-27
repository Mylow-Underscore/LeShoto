import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const LIEN_PAIEMENT = process.env.LIEN_PAIEMENT ?? "https://paiement.example.fr/leshoto";

interface Ligne {
  produit: string;
  modele: string | null;
  categorie: string;
  quantite: number;
  prix: string;
  noteClient: string | null;
}

function lignesHtml(lignes: Ligne[]): string {
  return lignes.map((l) => `
    <tr>
      <td style="color:#fff;font-size:14px;font-weight:600;padding:10px 0;border-bottom:1px solid #222;">${l.produit}${l.modele ? ` <span style="color:#BFBFBF;font-size:12px;">(${l.modele})</span>` : ""}</td>
      <td style="color:#BFBFBF;font-size:13px;text-align:center;padding:10px 0;border-bottom:1px solid #222;">×${l.quantite}</td>
      <td style="color:#FF66C4;font-size:14px;font-weight:700;text-align:right;padding:10px 0;border-bottom:1px solid #222;">${l.prix}</td>
    </tr>
    ${l.noteClient ? `<tr><td colspan="3" style="color:#8B88A8;font-size:12px;font-style:italic;padding:4px 0 10px;border-bottom:1px solid #222;">↳ ${l.noteClient}</td></tr>` : ""}
  `).join("");
}

export async function sendCommandeConfirmation({
  clientEmail, clientNom, clientCode, lignes, total, noteGlobale, commandeId, lienPaiement,
}: {
  clientEmail: string; clientNom: string; clientCode: string;
  lignes: Ligne[]; total: string; noteGlobale?: string;
  commandeId: number; lienPaiement: string;
}) {
  const html = `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#111;border:1px solid #222;">
  <div style="background:linear-gradient(135deg,#80004E,#FF66C4);padding:36px;">
    <p style="color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 6px;">⛩️ Le Shoto Manga Café</p>
    <h1 style="color:#fff;font-size:26px;font-weight:900;text-transform:uppercase;margin:0;">Commande #${commandeId}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#BFBFBF;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Bonjour <strong style="color:#fff;">${clientNom}</strong>, ta commande a bien été reçue !
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead><tr>
        <th style="color:#BFBFBF;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-align:left;padding-bottom:10px;border-bottom:1px solid #333;">Produit</th>
        <th style="color:#BFBFBF;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-align:center;padding-bottom:10px;border-bottom:1px solid #333;">Qté</th>
        <th style="color:#BFBFBF;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-align:right;padding-bottom:10px;border-bottom:1px solid #333;">Prix</th>
      </tr></thead>
      <tbody>${lignesHtml(lignes)}</tbody>
    </table>
    <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
      <div style="background:#1A1A1A;padding:12px 20px;text-align:right;">
        <p style="color:#BFBFBF;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 4px;">Total</p>
        <p style="color:#FF66C4;font-size:22px;font-weight:900;margin:0;">${total}</p>
      </div>
    </div>
    ${noteGlobale ? `<div style="background:#1A1A1A;padding:14px 18px;margin-bottom:24px;"><p style="color:#BFBFBF;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 4px;">Note</p><p style="color:#fff;font-size:14px;margin:0;">${noteGlobale}</p></div>` : ""}
    <div style="background:#80004E18;border:1px solid #80004E40;padding:16px 20px;margin-bottom:24px;">
      <p style="color:#BFBFBF;font-size:13px;margin:0;">Code client : <strong style="color:#FF66C4;letter-spacing:0.15em;">${clientCode}</strong></p>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <p style="color:#BFBFBF;font-size:14px;margin:0 0 14px;">Pour finaliser, règle le montant :</p>
      <a href="${lienPaiement}" style="display:inline-block;background:linear-gradient(135deg,#80004E,#FF66C4);color:#fff;text-decoration:none;padding:14px 36px;font-size:12px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Payer ${total} →</a>
    </div>
    <p style="color:#BFBFBF;font-size:13px;line-height:1.7;margin:0;border-top:1px solid #222;padding-top:20px;">
      Questions ? <a href="mailto:leshotomangashop@gmail.com" style="color:#FF66C4;text-decoration:none;">leshotomangashop@gmail.com</a> · <a href="tel:0633870964" style="color:#FF66C4;text-decoration:none;">06 33 87 09 64</a>
    </p>
  </div>
  <div style="background:#0A0A0A;padding:16px 32px;border-top:1px solid #222;text-align:center;">
    <p style="color:#333;font-size:11px;margin:0;">© ${new Date().getFullYear()} Le Shoto · 23 rue Georges Clémenceau · 11000 Carcassonne</p>
  </div>
</div>
</body></html>`;

  await transporter.sendMail({
    from: `"Le Shoto Manga Café" <${process.env.MAIL_USER}>`,
    to: clientEmail,
    subject: `Commande #${commandeId} confirmée · Le Shoto`,
    html,
  });
}

export async function sendCommandeNotifAdmin({
  clientNom, clientCode, clientEmail, clientTel, lignes, total, noteGlobale, commandeId,
}: {
  clientNom: string; clientCode: string; clientEmail?: string; clientTel?: string;
  lignes: Ligne[]; total: string; noteGlobale?: string; commandeId: number;
}) {
  const html = `
<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #222;padding:28px;">
  <p style="color:#FF66C4;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 6px;">⚡ Nouvelle commande</p>
  <h2 style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;margin:0 0 20px;">Commande #${commandeId} — ${clientNom}</h2>
  <p style="color:#BFBFBF;font-size:13px;margin:0 0 4px;">Code : <strong style="color:#FF66C4;">${clientCode}</strong></p>
  ${clientEmail ? `<p style="color:#BFBFBF;font-size:13px;margin:0 0 4px;">Email : ${clientEmail}</p>` : ""}
  ${clientTel ? `<p style="color:#BFBFBF;font-size:13px;margin:0 0 16px;">Tél : ${clientTel}</p>` : "<br>"}
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <tbody>${lignesHtml(lignes)}</tbody>
  </table>
  <p style="color:#FF66C4;font-size:18px;font-weight:900;text-align:right;margin:0 0 16px;">Total : ${total}</p>
  ${noteGlobale ? `<p style="color:#BFBFBF;font-size:13px;font-style:italic;margin:0 0 16px;">Note : ${noteGlobale}</p>` : ""}
  <div style="text-align:center;">
    <a href="${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3103"}/admin" style="display:inline-block;background:#80004E;color:#fff;text-decoration:none;padding:10px 24px;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;">Gérer dans l'admin →</a>
  </div>
</div>
</body></html>`;

  await transporter.sendMail({
    from: `"Le Shoto — Boutique" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `⚡ Commande #${commandeId} — ${clientNom} (${total})`,
    html,
  });
}