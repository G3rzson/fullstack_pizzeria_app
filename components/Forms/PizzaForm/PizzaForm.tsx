export default function PizzaForm() {
  return (
    <form className="flex flex-col gap-4 sm:w-4/5 w-full mx-auto dark:bg-zinc-800 bg-zinc-200 p-6 rounded-2xl">
      <input type="text" className="p-2" placeholder="Pizza neve" />
      <input type="text" className="p-2" placeholder="Pizza leírása" />
      <input type="text" className="p-2" placeholder="32-cm ára" />
      <input type="text" className="p-2" placeholder="45-cm ára" />
      <input type="file" />
      <button
        type="submit"
        className="dark:bg-green-900 bg-green-300 hover:bg-green-400 dark:hover:bg-green-800 duration-300 px-4 py-2 rounded"
      >
        Pizza hozzáadása
      </button>
    </form>
  );
}
