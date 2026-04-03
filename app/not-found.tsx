import ServerError from "@/shared/Components/ServerError";

export default function NotFound() {
  return (
    <ServerError
      errorMsg="Az oldal nem található."
      path="/"
      title="Vissza a főoldalra"
    />
  );
}
