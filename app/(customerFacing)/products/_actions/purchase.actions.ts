"use server";

import { PrismaClient } from "@prisma/client";
import { cache } from "@/lib/cache";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export async function getPurchase(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product == null) return notFound();
  } catch (error: any) {}
}
