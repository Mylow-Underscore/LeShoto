import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.clientId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const client = await prisma.fiche_Client.findUnique({
      where: { id: session.clientId },
    });

    if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

    const commandes = await prisma.commande.findMany({
      where: { clientCode: client.code_Reference },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ commandes });
  } catch (error) {
    console.error("List commandes error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}