// "use server";

// import { PrismaClient } from "@prisma/client";
// import { unstable_noStore as nostore } from "next/cache";

// const prisma = new PrismaClient();

// export async function getProducts() {
//   try {
//     nostore();
//     return prisma.product.findMany({
//       where: { isAvailableForPurchase: true },
//       orderBy: { name: "asc" },
//     });
//   } catch (error: any) {
//     console.log(`Error fetching products... ${error.message}`);
//   }
// }
