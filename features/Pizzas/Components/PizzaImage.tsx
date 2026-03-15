import Image from "next/image";
import { Pizza } from "lucide-react";

type Props = {
  publicUrl: string | null;
  originalName: string | null;
};

export default function PizzaImage({ publicUrl, originalName }: Props) {
  return (
    <>
      {publicUrl && originalName ? (
        <div className="absolute bottom-30 left-1/2 -translate-x-1/2 w-full flex justify-center">
          <div className="relative w-full aspect-square">
            <Image
              src={publicUrl}
              alt={originalName}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 300px"
              className="object-contain select-none pointer-events-none"
              loading="eager"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Pizza size={190} />
        </div>
      )}
    </>
  );
}
