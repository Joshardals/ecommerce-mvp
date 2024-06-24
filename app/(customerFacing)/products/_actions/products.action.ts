"use server";

import { PrismaClient } from "@prisma/client";
import { cache } from "@/lib/cache";

const prisma = new PrismaClient();

export const getProducts = cache(async () => {
  try {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { name: "asc" },
    });
  } catch (error: any) {
    console.log(`Error fetching products... ${error.message}`);
  }
}, ["/products", "getProducts"]);
