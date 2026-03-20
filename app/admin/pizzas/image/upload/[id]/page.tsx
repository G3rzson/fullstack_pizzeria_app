import PizzaImageForm from "@/features/Admin/Components/PizzaImageForm";

export default async function UploadImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return <PizzaImageForm id={id} />;
}
