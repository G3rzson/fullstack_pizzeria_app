import { CartItemType } from "@/lib/cart/CartContext";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { generateBlurUrl } from "@/lib/claudinary/generateBlurUrl";

export default function CartImage({ item }: { item: CartItemType }) {
  const imageUrl = item.product.image?.publicUrl;

  return (
    <div className="relative h-20 w-20 shrink-0">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${item.type}-kép`}
          fill
          placeholder="blur"
          blurDataURL={generateBlurUrl(imageUrl)}
          className="object-cover select-none pointer-events-none"
          sizes="80px"
        />
      ) : (
        <ImageIcon className="w-full h-full" />
      )}
    </div>
  );
}
