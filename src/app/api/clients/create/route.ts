import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { generateClientCode } from "@/lib/generateCode";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { nom, prenom, tel, email } = await req.json();

    if (!nom || !prenom) {
      return NextResponse.json({ error: "Nom et prénom requis" }, { status: 400 });
    }

    const code = await generateClientCode(nom, prenom);

    const existing = await prisma.fiche_Client.findUnique({
      where: { code_Reference: code },
    });

    if (existing) {
      return NextResponse.json({ error: "Code déjà existant, réessaie" }, { status: 409 });
    }

    const client = await prisma.fiche_Client.create({
      data: {
        nom_Prenom: `${nom.trim()} ${prenom.trim()}`,
        code_Reference: code,
        tel: tel ?? null,
        email: email ?? null,
        points_Fidelite: "0",
        bonus_Acquis: "Aucun",
        achats: "0",
      },
    });

    return NextResponse.json({ success: true, client, code });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}