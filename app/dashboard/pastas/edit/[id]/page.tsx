import PastaForm from "../../_components/PastaForm";

export default async function EditPastaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <PastaForm id={id} />;
}
