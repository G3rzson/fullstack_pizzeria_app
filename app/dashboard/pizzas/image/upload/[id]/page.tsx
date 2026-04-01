import PizzaImageForm from "@/app/dashboard/pizzas/_components/PizzaImageForm";

export default async function UploadImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="flex grow items-center justify-center">
      <PizzaImageForm id={id} />
    </div>
  );
}
