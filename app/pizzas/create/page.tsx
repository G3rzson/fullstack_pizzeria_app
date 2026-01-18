import PizzaForm from "@/components/Forms/PizzaForm/PizzaForm";

export default function Page() {
  return (
    <div className="px-4">
      <h1 className="text-center text-3xl my-8">Új pizza létrehozása</h1>
      <PizzaForm />
    </div>
  );
}
