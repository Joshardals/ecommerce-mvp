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

export async function getUserData() {
  try {
    const [userCount, orderData] = await Promise.all([
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { pricePaidInCents: true },
      }),
    ]);

    return {
      userCount,
      averageValuePerUser:
        userCount === 0
          ? 0
          : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
    };
  } catch (error: any) {
    console.log(`Error fetching User Data... ${error.message}`);
  }
}

export async function getProductData() {
  try {
    const [activeCount, inactiveCount] = await Promise.all([
      prisma.product.count({ where: { isAvailableForPurchase: true } }),
      prisma.product.count({ where: { isAvailableForPurchase: false } }),
    ]);

    return {
      activeCount,
      inactiveCount,
    };
  } catch (error: any) {
    console.log(`Error fetching Product Data... ${error.message}`);
  }
}
