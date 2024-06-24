"use server";

import { PrismaClient } from "@prisma/client";
// import { unstable_noStore as nostore } from "next/cache";
import { cache } from "@/lib/cache";

const prisma = new PrismaClient();

export const getMostPopularProducts = cache(async () => {
  try {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  } catch (error: any) {
    console.log(`Error fetching newest products... ${error.message}`);
  }
}, ["/", "getMostPopularProducts"]);

export async function getNewestProducts() {
  try {
    // nostore();
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (error: any) {
    console.log(`Error fetching newest products... ${error.message}`);
  }
}
