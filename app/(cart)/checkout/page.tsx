import { type AddressDtoType } from "@/shared/Types/types";
import CheckoutForm from "./_components/CheckoutForm";
import { getAddressByIdAction } from "./_actions/getAddressByIdAction";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { user: string };
}) {
  const params = await searchParams;
  const user = params.user || "guest";

  let address: AddressDtoType | null = null;

  if (user === "guest") {
    address = null;
  } else {
    const response = await getAddressByIdAction(user);

    if (response.success && response.data) {
      address = response.data;
    } else {
      address = null;
    }
  }

  return (
    <div className="centered-container">
      <CheckoutForm address={address} userId={user === "guest" ? null : user} />
    </div>
  );
}
