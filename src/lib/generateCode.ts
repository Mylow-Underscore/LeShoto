import { prisma } from "@/lib/prisma";

export async function generateClientCode(nom: string, prenom: string): Promise<string> {
  const letterNom = nom.trim()[0].toUpperCase();
  const letterPrenom = prenom.trim()[0].toUpperCase();
  const prefix = `${letterNom}${letterPrenom}`;

  const last = await prisma.fiche_Client.findFirst({
    where: { code_Reference: { startsWith: prefix } },
    orderBy: { code_Reference: "desc" },
  });

  let nextNum = 100;

  if (last?.code_Reference) {
    const numPart = parseInt(last.code_Reference.replace(prefix, ""), 1);
    if (!isNaN(numPart)) nextNum = numPart + 1;
  }

  return `${prefix}${nextNum}`;
}