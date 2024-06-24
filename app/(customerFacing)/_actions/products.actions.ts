"use server";

import { PrismaClient } from "@prisma/client";
import { cache } from "@/lib/cache";

const prisma = new PrismaClient();

export const getMostPopularProducts = cache(
  async () => {
    try {
      return prisma.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: 6,
      });
    } catch (error: any) {
      console.log(`Error fetching newest products... ${error.message}`);
    }
  },
  ["/", "getMostPopularProducts"],
  { revaildate: 60 * 60 * 24 }
);

export const getNewestProducts = cache(async () => {
  try {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (error: any) {
    console.log(`Error fetching newest products... ${error.message}`);
  }
}, ["/", "getNewestProducts"]);
