import ServerError from "@/shared/Components/ServerError";
import { getPastaByIdAction } from "../../_actions/getPastaByIdAction";
import PastaForm from "../../_components/PastaForm";

export default async function EditPastaPage({
  params,
}: {
  params: Promise<{ pastaId: string }>;
}) {
  const pastaId = (await params).pastaId;

  const response = await getPastaByIdAction(pastaId);

  if (!response.success || !response.data) {
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard/pastas"
        title="Vissza a tésztákhoz"
      />
    );
  }
  return (
    <div className="flex grow items-center justify-center">
      <PastaForm pastaObject={response.data} />
    </div>
  );
}
