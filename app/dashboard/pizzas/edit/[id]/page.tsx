import PizzaForm from "../../_components/PizzaForm";

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <PizzaForm id={id} />;
}
