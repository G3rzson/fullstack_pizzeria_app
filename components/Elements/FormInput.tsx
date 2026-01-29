"use client";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  registername: Path<T>;
  type: "text" | "textarea";
  placeholder: string;
  errors?: FieldErrors<T>;
};

export default function FormInput<T extends FieldValues>({
  register,
  registername,
  type,
  placeholder,
  errors,
}: Props<T>) {
  if (type === "textarea") {
    return (
      <textarea
        className="bg-white text-black p-2 w-full"
        placeholder={placeholder}
        rows={3}
        {...register(registername)}
      />
    );
  }
  return (
    <div className="relative w-full">
      <input
        type={type}
        className="bg-white text-black p-2 w-full"
        placeholder={placeholder}
        {...register(registername)}
      />
      {errors && errors[registername] && (
        <p className="text-red-400 text-sm absolute -bottom-6 left-0">
          {errors[registername]?.message as string}
        </p>
      )}
    </div>
  );
}
