import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import { confirmPurchase } from "../../products/_actions/purchase.actions";
import { notFound } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const results = await confirmPurchase(searchParams.payment_intent);
  if (!results) return notFound();

  const { product, isSuccess } = results;
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl">{isSuccess ? "Success" : "Error!"}</h1>
      <h1 className=" text-4xl">{results.isSuccess ? "Success" : "Error!"}</h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={results.product.imagePath}
            fill
            alt={results.product.name}
            className="object-cover"
          />
        </div>
        <div className="text-lg">
          {formatCurrency(results.product.priceInCents / 100)}
        </div>
        <h1 className="text-2xl font-bold">{results.product.name}</h1>
        <div className="line-clamp-3 text-muted-foreground">
          {results.product.description}
        </div>
      </div>
    </div>
  );
}
