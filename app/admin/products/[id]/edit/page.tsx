import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm />
    </>
  );
}
