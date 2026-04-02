import ServerError from "@/shared/Components/ServerError";
import { getDrinkByIdAction } from "../../_actions/getDrinkByIdAction";
import DrinkForm from "../../_components/DrinkForm";

export default async function EditPastaPage({
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
    <div className="flex grow items-center justify-center">
      <DrinkForm drinkObject={response.data} />
    </div>
  );
}
