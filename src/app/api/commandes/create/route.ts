import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { sendCommandeConfirmation, sendCommandeNotifAdmin } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.code || !session.clientId) {
      return NextResponse.json({ error: "Connecte-toi pour commander." }, { status: 401 });
    }

    const body = await req.json();
    const { noteGlobale } = body;

    const client = await prisma.fiche_Client.findUnique({
      where: { id: session.clientId },
    });
    if (!client) return NextResponse.json({ error: "Client introuvable." }, { status: 404 });

    const panierItems = await prisma.panier.findMany({
      where: { clientCode: session.code },
    });
    if (panierItems.length === 0) {
      return NextResponse.json({ error: "Ton panier est vide." }, { status: 400 });
    }

    const total = panierItems.reduce((acc, item) => {
      const price = parseFloat(item.prix.replace(",", ".").replace("€", "").trim());
      return acc + (isNaN(price) ? 0 : price * item.quantite);
    }, 0);
    const totalStr = `${total.toFixed(2).replace(".", ",")}€`;

    const commande = await prisma.commande.create({
      data: {
        clientCode: client.code_Reference,
        clientNom: client.nom_Prenom,
        clientEmail: client.email ?? null,
        clientTel: client.tel ?? null,
        total: totalStr,
        statut: "en_attente",
        noteGlobale: noteGlobale ?? null,
        lienPaiement: process.env.LIEN_PAIEMENT ?? "https://paiement.example.fr/leshoto",
        lignes: {
          create: panierItems.map((item) => ({
            categorie: item.categorie,
            produit: item.produit,
            modele: item.modele,
            quantite: item.quantite,
            prix: item.prix,
            personnalise: item.personnalise,
            noteClient: item.noteClient,
          })),
        },
      },
      include: { lignes: true },
    });

    await prisma.panier.deleteMany({ where: { clientCode: session.code } });

    if (client.email) {
      await sendCommandeConfirmation({
        clientEmail: client.email,
        clientNom: client.nom_Prenom,
        clientCode: client.code_Reference,
        lignes: commande.lignes,
        total: totalStr,
        noteGlobale: noteGlobale ?? undefined,
        commandeId: commande.id,
        lienPaiement: commande.lienPaiement ?? "",
      });
    }

    await sendCommandeNotifAdmin({
      clientNom: client.nom_Prenom,
      clientCode: client.code_Reference,
      clientEmail: client.email ?? undefined,
      clientTel: client.tel ?? undefined,
      lignes: commande.lignes,
      total: totalStr,
      noteGlobale: noteGlobale ?? undefined,
      commandeId: commande.id,
    });

    return NextResponse.json({ success: true, commandeId: commande.id, total: totalStr });
  } catch (e) {
    console.error("Commande error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}