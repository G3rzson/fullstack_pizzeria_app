import { Suspense } from "react";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex grow items-center justify-center">
      <Suspense fallback={<div>Betöltés...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
