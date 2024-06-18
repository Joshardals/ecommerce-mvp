"use server";

import { PrismaClient } from "@prisma/client";
import { unstable_noStore as nostore } from "next/cache";

const prisma = new PrismaClient();

export async function getSalesData() {
  try {
    nostore();
    const data = await prisma.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    });

    return {
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
    };
  } catch (error: any) {
    console.log(`Error fetching Sales Data... ${error.message}`);
  }
}
