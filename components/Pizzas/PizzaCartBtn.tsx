import { ShoppingCart } from "lucide-react";
export default function PizzaCartBtn({ pizzaId }: { pizzaId: string }) {
  function handleCart(pizzaId: string) {
    console.log("kosárhoz adás lefejlesztése");
    console.log("Added to cart pizza with ID:", pizzaId);
    // Here you can add your logic to add the pizza to the cart
  }
  return (
    <button
      type="button"
      onClick={() => handleCart(pizzaId)}
      className="cursor-pointer"
    >
      <ShoppingCart className="text-green-700 hover:text-green-600 duration-300" />
    </button>
  );
}
