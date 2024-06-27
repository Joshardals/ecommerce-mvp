"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function userOrderExists(email: string, productId: string) {
  try {
    return (
      (await prisma.order.findFirst({
        where: { user: { email }, productId },
        select: { id: true },
      })) != null
    );
  } catch (error: any) {
    console.log(`Error checking if order exists... ${error.message}`);
  }
}
