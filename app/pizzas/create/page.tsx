import PizzaForm from "@/components/Forms/PizzaForm";

export default function Page() {
  return (
    <div className="flex flex-col grow items-center justify-center gap-8">
      <h1 className="text-center text-3xl">Új pizza létrehozása</h1>
      <PizzaForm />
    </div>
  );
}
