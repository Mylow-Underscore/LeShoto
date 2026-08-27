import { prisma } from "@/lib/prisma";

export async function generateClientCode(nom: string, prenom: string): Promise<string> {

  const prefix = `${nom[0]}${prenom[0]}`;

  const lastCodeResult = await prisma.fiche_Client.findFirst({
    where: { code_Reference: { startsWith: prefix } },
    orderBy: { code_Reference: "desc" }
  });

  let nextNum;

  if (lastCodeResult?.code_Reference) {
    const numMatch = lastCodeResult.code_Reference.match(/\d+$/)?.[0];
    
    if (!numMatch || isNaN(parseInt(numMatch, 10))) {
      throw new Error(`Expected numeric suffix after "${prefix}" in reference codes`);
    }
    
    const lastNumber = parseInt(lastCodeResult.code_Reference.replace(prefix, ""), 10);
    nextNum = (lastNumber + 1).toString().padStart(3, '0');
  } else {
    nextNum = "1".padStart(3, '0');
  }

  return `${prefix}${nextNum}`;
}