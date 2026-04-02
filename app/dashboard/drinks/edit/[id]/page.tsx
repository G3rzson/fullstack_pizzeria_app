import PastaForm from "../../_components/DrinkForm";

export default async function EditPastaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="flex grow items-center justify-center">
      <PastaForm id={id} />
    </div>
  );
}
