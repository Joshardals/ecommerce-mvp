import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import { confirmPurchase } from "../../products/_actions/purchase.actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div className="text-lg">
          {formatCurrency(product.priceInCents / 100)}
        </div>
        <h1 className="text-2xl font-bold">{results.product.name}</h1>
        <div className="line-clamp-3 text-muted-foreground">
          {product.description}
        </div>
        <Button className="mt-4" size={"lg"} asChild>
          {isSuccess ? (
            <a></a>
          ) : (
            <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
