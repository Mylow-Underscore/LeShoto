import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
 
export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    const commandes = await prisma.commande.findMany({
      orderBy: { createdAt: "desc" },
      include: { lignes: true },
    });
    return NextResponse.json({ commandes });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
 
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
 
    const { id, statut } = await req.json();
 
    const STATUTS_VALIDES = ["en_attente", "confirmee", "en_preparation", "prete", "recuperee", "annulee"];
    if (!STATUTS_VALIDES.includes(statut)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
 
    const commande = await prisma.commande.findUnique({
      where: { id },
      include: { lignes: true },
    });
    if (!commande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
 
    const ancienStatut = commande.statut;
 
    const updated = await prisma.commande.update({
      where: { id },
      data: { statut },
      include: { lignes: true },
    });
 
    if (statut === "recuperee" && ancienStatut !== "recuperee") {
      const total = parseFloat(commande.total.replace(",", ".").replace("€", "").trim());
      const pointsGagnes = Math.floor(total);
 
      if (pointsGagnes > 0) {
        const client = await prisma.fiche_Client.findUnique({
          where: { code_Reference: commande.clientCode },
        });
 
        if (client) {
          const current = parseInt(client.points_Fidelite ?? "0", 10) || 0;
          const newPoints = current + pointsGagnes;
          const currentAchats = parseInt(client.achats ?? "0", 10) || 0;
 
          await prisma.fiche_Client.update({
            where: { code_Reference: commande.clientCode },
            data: {
              points_Fidelite: newPoints.toString(),
              achats: (currentAchats + 1).toString(),
            },
          });
 
          return NextResponse.json({
            success: true,
            commande: updated,
            pointsCredites: pointsGagnes,
            nouveauTotal: newPoints,
            message: `+${pointsGagnes} pts crédités à ${commande.clientNom}`,
          });
        }
      }
    }
 
    if (ancienStatut === "recuperee" && statut !== "recuperee") {
      const total = parseFloat(commande.total.replace(",", ".").replace("€", "").trim());
      const pointsARetirer = Math.floor(total);
 
      if (pointsARetirer > 0) {
        const client = await prisma.fiche_Client.findUnique({
          where: { code_Reference: commande.clientCode },
        });
 
        if (client) {
          const current = parseInt(client.points_Fidelite ?? "0", 10) || 0;
          const newPoints = Math.max(0, current - pointsARetirer);
          const currentAchats = parseInt(client.achats ?? "0", 10) || 0;
 
          await prisma.fiche_Client.update({
            where: { code_Reference: commande.clientCode },
            data: {
              points_Fidelite: newPoints.toString(),
              achats: Math.max(0, currentAchats - 1).toString(),
            },
          });
        }
      }
    }
 
    return NextResponse.json({ success: true, commande: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}