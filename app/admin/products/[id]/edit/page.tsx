import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import { getUniqueProduct } from "../../_actions/products.actions";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getUniqueProduct(id);
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
