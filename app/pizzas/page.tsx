import CustomLink from "@/components/ui/CustomLink";
import { ArrowBigRight } from "lucide-react";

export default function PizzasPage() {
  return (
    <>
      <h1 className="page-title">Pizzák</h1>

      <CustomLink href="/pizzas/new">
        Új pizza hozzáadása
        <ArrowBigRight />
      </CustomLink>
    </>
  );
}
