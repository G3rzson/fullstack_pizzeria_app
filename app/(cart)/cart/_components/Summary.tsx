import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTotalPrice } from "@/shared/Functions/cartHelper";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import { useAuth } from "@/lib/auth/useAuth";
import { type CartItemType } from "@/lib/cart/CartContext";

export default function Summary({ cartItems }: { cartItems: CartItemType[] }) {
  const { user } = useAuth();
  return (
    <Card className="bg-gradient p-0 gap-0">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Végösszeg:</span>
          <span className="text-2xl font-bold text-success">
            {priceFormatter(getTotalPrice(cartItems))}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <MenuNavLink
          href={`/checkout${user ? `?user=${user.id}` : "?user=guest"}`}
          title="Tovább a fizetéshez"
        />
      </CardFooter>
    </Card>
  );
}
