import ImageForm from "@/shared/Components/ImageForm";
import { getDrinkByIdAction } from "../../../_actions/getDrinkByIdAction";
import ServerError from "@/shared/Components/ServerError";
import { updateDrinkImageAction } from "../../../_actions/updateDrinkImageAction";
import { uploadDrinkImageAction } from "../../../_actions/uploadDrinkImageAction";

export default async function UploadDrinkImagePage({
  params,
}: {
  params: Promise<{ drinkId: string }>;
}) {
  const drinkId = (await params).drinkId;

  const response = await getDrinkByIdAction(drinkId);

  if (!response.success || !response.data) {
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard/drinks"
        title="Vissza az italokhoz"
      />
    );
  }

  return (
    <div className="centered-container">
      <ImageForm
        returnUrl="/dashboard/drinks"
        menuObject={response.data}
        updateImageAction={updateDrinkImageAction}
        uploadImageAction={uploadDrinkImageAction}
      />
    </div>
  );
}
