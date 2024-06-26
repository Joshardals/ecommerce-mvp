"use server";

import { z } from "zod";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { File } from "node-fetch";

const prisma = new PrismaClient();

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProducts(prevState: unknown, formData: FormData) {
  try {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
      return result.error.formErrors.fieldErrors;
    }

    const data = result.data;

    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );

    await prisma.product.create({
      data: {
        isAvailableForPurchase: false,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    });
  } catch (error: any) {
    console.log(`Error adding products... ${error.message}`);
  }
  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        _count: { select: { orders: true } },
      },
      orderBy: { name: "asc" },
    });

    if (products.length === 0) console.log("No product found");
    return products;
  } catch (error: any) {
    console.log(`Error fetching Products... ${error.message}`);
  }
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        isAvailableForPurchase,
      },
    });

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error: any) {
    console.log(`Error fetching data ... ${error.message}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.delete({ where: { id } });

    if (product == null) return notFound();

    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error: any) {
    console.log(`Error deleting product ... ${error.message}`);
  }
}

export async function getUniqueProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });

    return product;
  } catch (error: any) {
    console.log(`Error fetching product... ${error.message}`);
  }
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProducts(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
      return result.error.formErrors.fieldErrors;
    }

    const data = result.data;
    const product = await prisma.product.findUnique({ where: { id } });

    if (product == null) return notFound();

    let filePath = product.filePath;

    if (data.file != null && data.file.size > 0) {
      await fs.unlink(product.filePath);
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    }

    let imagePath = product.imagePath;

    if (data.image != null && data.image.size > 0) {
      await fs.unlink(`public${product.imagePath}`);
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      );
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    });
  } catch (error: any) {
    console.log(`Error adding products... ${error.message}`);
  }
  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function getProductFilePath(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { filePath: true, name: true },
    });
    return product;
  } catch (error: any) {
    console.log(`Error fetching product... ${error.message}`);
  }
}
