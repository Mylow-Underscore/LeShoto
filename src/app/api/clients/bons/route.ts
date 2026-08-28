import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { POINTS_BON, VALEUR_BON } from "@/constants";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const { clientId, operation, montant, raison } = body;

    if (!clientId || !operation || !montant) {
      return NextResponse.json({ error: "clientId, operation et montant sont requis." }, { status: 400 });
    }

    if (!["ajouter", "retirer"].includes(operation)) {
      return NextResponse.json({ error: "Opération invalide. Valeurs acceptées : ajouter, retirer." }, { status: 400 });
    }

    const delta = parseInt(String(montant), 10);
    if (isNaN(delta) || delta <= 0) {
      return NextResponse.json({ error: "Le montant doit être un entier positif." }, { status: 400 });
    }

    const client = await prisma.fiche_Client.findUnique({
      where: { id: Number(clientId) },
    });

    if (!client) {
      return NextResponse.json({ error: "Client introuvable." }, { status: 404 });
    }

    const nombrepoits = parseInt(client.points_Fidelite ?? "0", 10) || 0;
    let nombrebons = Math.floor(nombrepoits / POINTS_BON);
    

    const nouveauTotal =
      operation === "ajouter"
        ? nombrebons + delta
        : Math.max(0, nombrebons - delta);

    const deltaReel = operation === "ajouter" ? delta : nombrebons - nouveauTotal;

    await prisma.fiche_Client.update({
      where: { id: Number(clientId) },
      data: { points_Fidelite: nouveauTotal.toString() },
    });

    const bonsAvant = Math.floor(nombrebons);
    const bonsApres = Math.floor(nouveauTotal);
    const nouveauBon = bonsApres > bonsAvant;
    const bonsRestants = nouveauTotal % POINTS_BON;
    const prochainBon = nouveauTotal - bonsRestants;

    console.log(
      `[POINTS] ${operation} ${deltaReel}pts | ${client.code_Reference} | ${nombrebons} → ${nouveauTotal} | raison: ${raison ?? "—"}`
    );

    return NextResponse.json({
      success: true,
      code: client.code_Reference,
      nomPrenom: client.nom_Prenom,
      nombrebons,
      nouveauTotal,
      delta: operation === "ajouter" ? `+${deltaReel}` : `-${deltaReel}`,
      bonDachatDisponibles: bonsApres,
      nouveauBon,
      bonsRestants,
      prochainBon,
      valeurBon: VALEUR_BON,
    });
  } catch (error) {
    console.error("[POINTS] Error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}