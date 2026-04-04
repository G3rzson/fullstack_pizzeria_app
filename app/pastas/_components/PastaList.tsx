import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import { getAllAvailablePastaAction } from "../_actions/getAllAvailablePastaAction";
import { textFormatter } from "@/shared/Functions/textFormatter";
import AddToCartBtn from "@/shared/Components/AddToCartBtn";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";

export default async function PastaList() {
  const response = await getAllAvailablePastaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető tészta!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pasta) => (
        <li key={pasta.id}>
          <Card className="bg-gradient h-full w-full">
            <div className="flex flex-row items-start justify-between gap-4 px-4">
              {pasta.image ? (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <Image
                    src={pasta.image.publicUrl}
                    alt={pasta.pastaName}
                    fill
                    placeholder="blur"
                    blurDataURL={generateBlurUrl(pasta.image.publicUrl)}
                    className="object-cover select-none pointer-events-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <ImageIcon className="w-full h-full" />
                </div>
              )}

              <div className="flex flex-col items-end justify-end gap-2 h-full">
                <CardTitle className="card-title">
                  {textFormatter(pasta.pastaName)}
                </CardTitle>

                <p className="card-description">{pasta.pastaDescription}</p>

                <p className="text-end text-success font-semibold mt-auto whitespace-nowrap">
                  {pasta.pastaPrice} Ft
                </p>
              </div>
            </div>

            <CardFooter>
              <AddToCartBtn menu={pasta} type="pasta" />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
