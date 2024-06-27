"use server";

import { PrismaClient } from "@prisma/client";
import { cache } from "@/lib/cache";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function getPurchase(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product == null) return notFound();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.priceInCents,
      currency: "USD",
      metadata: { productId: product.id },
    });

    if (paymentIntent.client_secret == null) {
      throw Error("Stripe failed to create payment intent");
    }

    return {
      product,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.log(`Error fetching purchase: ${error.message}`);
  }
}

export async function confirmPurchase(paymentIntent: string) {
  try {
    const payment = await stripe.paymentIntents.retrieve(paymentIntent);

    if (payment == null) return notFound();

    const product = await prisma.product.findUnique({
      where: { id: payment.metadata.productId },
    });

    if (product == null) return notFound();

    return {
      product,
      isSuccess: payment.status === "succeeded",
    };
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
  }
}
