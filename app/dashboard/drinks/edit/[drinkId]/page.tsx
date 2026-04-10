import ServerError from "@/shared/Components/ServerError";
import { getDrinkByIdAction } from "../../_actions/getDrinkByIdAction";
import DrinkForm from "../../_components/DrinkForm";

export default async function EditDrinkPage({
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
      <DrinkForm drinkObject={response.data} />
    </div>
  );
}
