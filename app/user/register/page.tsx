import RegisterForm from "@/components/Forms/RegisterForm";

export default function Page() {
  return (
    <div className="flex flex-col grow gap-8 items-center justify-center">
      <h1 className="text-center text-3xl">Regisztráció</h1>

      <RegisterForm />
    </div>
  );
}
