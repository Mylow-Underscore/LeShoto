import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.clientId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const client = await prisma.fiche_Client.findUnique({
      where: { id: session.clientId },
    });

    if (!client) {
      session.destroy();
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      client: {
        id: client.id,
        code: client.code_Reference,
        nomPrenom: client.nom_Prenom,
        points: client.points_Fidelite ?? "0",
        bonus: client.bonus_Acquis ?? "Aucun",
        tel: client.tel,
        email: client.email,
        achats: client.achats,
        createdAt: client.createdAt,
      },
      isAdmin: session.isAdmin ?? false,
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}