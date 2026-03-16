import PizzaForm from "@/features/Pizzas/Components/PizzaForm";

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <PizzaForm id={id} />;
}
