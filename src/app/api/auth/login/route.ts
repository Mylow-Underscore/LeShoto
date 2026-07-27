import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = body?.code;

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json({ error: "Code manquant" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    let client;
    try {
      client = await prisma.fiche_Client.findUnique({
        where: { code_Reference: normalizedCode },
      });
    } catch (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Impossible de contacter la base de données. Réessaie dans un instant." },
        { status: 503 }
      );
    }

    if (!client) {
      return NextResponse.json(
        { error: "Code client invalide. Contacte-nous si tu penses que c'est une erreur." },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.clientId = client.id;
    session.code = client.code_Reference;
    session.nomPrenom = client.nom_Prenom;
    session.points = client.points_Fidelite ?? "0";
    session.bonus = client.bonus_Acquis ?? "Aucun";
    session.isLoggedIn = true;
    session.isAdmin = client.code_Reference === process.env.ADMIN_CODE;
    await session.save();

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        code: client.code_Reference,
        nomPrenom: client.nom_Prenom,
        points: client.points_Fidelite,
        bonus: client.bonus_Acquis,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}