import PizzaForm from "../../_components/PizzaForm";

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="flex grow items-center justify-center">
      <PizzaForm id={id} />
    </div>
  );
}
