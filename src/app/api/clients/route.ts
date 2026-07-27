import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const clients = await prisma.fiche_Client.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      clients: clients.map((c) => ({
        id: c.id,
        code: c.code_Reference,
        nomPrenom: c.nom_Prenom,
        points: c.points_Fidelite,
        bonus: c.bonus_Acquis,
        tel: c.tel,
        email: c.email,
        achats: c.achats,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("List clients error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}