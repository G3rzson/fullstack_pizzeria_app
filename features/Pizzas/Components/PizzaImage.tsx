import Image from "next/image";
import { Pizza } from "lucide-react";
import { ImageType } from "../Dal/pizza.dal";

type Props = {
  pizzaImage: ImageType | null;
};

export default function PizzaImage({ pizzaImage }: Props) {
  return (
    <>
      {pizzaImage ? (
        <Image
          src={pizzaImage.publicUrl}
          alt={pizzaImage.originalName}
          width={150}
          height={150}
          className="object-contain select-none pointer-events-none"
          loading="eager"
        />
      ) : (
        <Pizza size={150} />
      )}
    </>
  );
}
