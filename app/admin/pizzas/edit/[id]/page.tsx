import PizzaForm from "@/features/Admin/Components/PizzaForm";

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <PizzaForm id={id} />;
}
