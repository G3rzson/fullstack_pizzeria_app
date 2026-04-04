import ImageForm from "@/shared/Components/ImageForm";
import { uploadPastaImageAction } from "../../../_actions/uploadPastaImageAction";
import { getPastaByIdAction } from "../../../_actions/getPastaByIdAction";
import { updatePastaImageAction } from "../../../_actions/updatePastaImageAction";
import ServerError from "@/shared/Components/ServerError";

export default async function UploadPastaImagePage({
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
    <div className="centered-container">
      <ImageForm
        returnUrl={"/dashboard/pastas"}
        menuObject={response.data}
        updateImageAction={updatePastaImageAction}
        uploadImageAction={uploadPastaImageAction}
      />
    </div>
  );
}
