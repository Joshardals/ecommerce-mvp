import { notFound } from "next/navigation";
import { getPurchase } from "../../_actions/purchase.actions";
import { CheckoutForm } from "./_components/CheckoutForm";

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const results = await getPurchase(id);
  if (!results) return notFound();

  const { product, clientSecret } = results;
  return (
    <CheckoutForm
      product={{
        id: product.id,
        imagePath: product.imagePath,
        name: product.name,
        priceInCents: product.priceInCents,
        description: product.description,
      }}
      clientSecret={clientSecret!}
    />
  );
}
