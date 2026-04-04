import ImageForm from "@/shared/Components/ImageForm";
import { uploadPizzaImageAction } from "../../../_actions/uploadPizzaImageAction";
import { updatePizzaImageAction } from "../../../_actions/updatePizzaImageAction";
import { getPizzaByIdAction } from "../../../_actions/getPizzaByIdAction";
import ServerError from "@/shared/Components/ServerError";

export default async function UploadPizzaImagePage({
  params,
}: {
  params: Promise<{ pizzaId: string }>;
}) {
  const pizzaId = (await params).pizzaId;

  const response = await getPizzaByIdAction(pizzaId);

  if (!response.success || !response.data) {
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard/pizzas"
        title="Vissza a pizzákhoz"
      />
    );
  }

  return (
    <div className="centered-container">
      <ImageForm
        returnUrl={"/dashboard/pizzas"}
        menuObject={response.data}
        updateImageAction={updatePizzaImageAction}
        uploadImageAction={uploadPizzaImageAction}
      />
    </div>
  );
}
