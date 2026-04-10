import { Button } from "@/components/ui/button";
import { increaseQuantity } from "../_functions/increaseQuantity";
import { decreaseQuantity } from "../_functions/decreaseQuantity";
import { saveToLocalStorage } from "@/lib/localStorage/localStorage";
import { useCart } from "@/lib/cart/useCart";
import { type CartItemType } from "@/lib/cart/CartContext";
import { removeFromCart } from "../_functions/removeFromCart";

type Props = {
  children: React.ReactNode;
  item: CartItemType;
  action: "increase" | "decrease" | "remove";
};

export default function CartFnBtn({ children, item, action }: Props) {
  const { cartItems, setCartItems } = useCart();

  function handleIncreaseQuantity() {
    const updatedCart = increaseQuantity(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  }

  function handleDecreaseQuantity() {
    const updatedCart = decreaseQuantity(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  }

  function handleRemoveItem() {
    const updatedCart = removeFromCart(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={() => {
        if (action === "increase") {
          handleIncreaseQuantity();
        } else if (action === "decrease") {
          handleDecreaseQuantity();
        } else if (action === "remove") {
          handleRemoveItem();
        }
      }}
      className="h-8 w-8 cursor-pointer"
    >
      {children}
    </Button>
  );
}
