"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeClosed, EyeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { createPassword } from "../Functions/createPassword";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  isSubmitting: boolean;
};

export default function CustomPassword<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isSubmitting,
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="relative" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {pathname === "/auth/register" && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              size="icon"
              className="max-w-fit py-2 px-4 absolute right-0 -top-2"
              onClick={() => field.onChange(createPassword())}
            >
              Jelszó ajánlása
            </Button>
          )}

          <Input
            id={field.name}
            {...field}
            type={showPassword ? "text" : "password"}
            value={field.value ?? ""}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            disabled={isSubmitting}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="max-w-fit absolute right-2 top-6.75"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeClosed /> : <EyeIcon />}
          </Button>
        </Field>
      )}
    />
  );
}
