import Loading from "../loading";

export function UserMenuLoadingState() {
  return (
    <div
      className="w-40 h-20 flex items-center justify-center"
      aria-label="Felhasználó betöltése"
    >
      <Loading />
    </div>
  );
}
