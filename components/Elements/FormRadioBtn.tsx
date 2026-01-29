import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  registername: Path<T>;
  errors?: FieldErrors<T>;
};

export default function FormRadioBtn<T extends FieldValues>({
  register,
  registername,
  errors,
}: Props<T>) {
  return (
    <>
      <div className="relative w-full flex flex-col">
        <div className="flex gap-4 items-center">
          <p>Méret:</p>
          <label htmlFor="pizzaSize32cm" className="cursor-pointer">
            32 cm
          </label>
          <input
            id="pizzaSize32cm"
            type="radio"
            value="32cm"
            className="cursor-pointer"
            {...register(registername)}
          />
          <label htmlFor="pizzaSize45cm" className="cursor-pointer">
            45 cm
          </label>
          <input
            id="pizzaSize45cm"
            type="radio"
            value="45cm"
            className="cursor-pointer"
            {...register(registername)}
          />
        </div>
        {errors && errors[registername] && (
          <p className="text-red-400 text-sm absolute -bottom-6 left-0">
            {errors[registername]?.message as string}
          </p>
        )}
      </div>
    </>
  );
}
