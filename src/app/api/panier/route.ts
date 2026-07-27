import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.code) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }
    const items = await prisma.panier.findMany({
      where: { clientCode: session.code },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.code) {
      return NextResponse.json({ error: "Connecte-toi pour ajouter au panier." }, { status: 401 });
    }
    const body = await req.json();
    const { categorie, produit, modele, quantite, prix, personnalise, noteClient } = body;
    if (!produit || !prix || !categorie) {
      return NextResponse.json({ error: "Informations manquantes." }, { status: 400 });
    }
    const item = await prisma.panier.create({
      data: {
        clientCode: session.code,
        categorie,
        produit,
        modele: modele ?? null,
        quantite: quantite ?? 1,
        prix,
        personnalise: personnalise ?? false,
        noteClient: noteClient ?? null,
      },
    });
    const count = await prisma.panier.count({ where: { clientCode: session.code } });
    return NextResponse.json({ success: true, item, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.code) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }
    const { id, quantite } = await req.json();
    if (!id || !quantite || quantite < 1) {
      return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
    }
    const item = await prisma.panier.findUnique({ where: { id } });
    if (!item || item.clientCode !== session.code) {
      return NextResponse.json({ error: "Item introuvable." }, { status: 404 });
    }
    const updated = await prisma.panier.update({
      where: { id },
      data: { quantite },
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.code) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }
    const { id } = await req.json();
    const item = await prisma.panier.findUnique({ where: { id } });
    if (!item || item.clientCode !== session.code) {
      return NextResponse.json({ error: "Item introuvable." }, { status: 404 });
    }
    await prisma.panier.delete({ where: { id } });
    const count = await prisma.panier.count({ where: { clientCode: session.code } });
    return NextResponse.json({ success: true, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}