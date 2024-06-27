"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDownloadVerfication(id: string) {
  try {
    const data = await prisma.downloadVerification.findUnique({
      where: { id, expiresAt: { gt: new Date() } },
      select: { product: { select: { filePath: true, name: true } } },
    });

    console.log(data);
    return data;
  } catch (error: any) {
    console.log(`Error... ${error.message}`);
  }
}
