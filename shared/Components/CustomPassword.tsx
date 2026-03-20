"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

export default function CustomPassword<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="relative" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            id={field.name}
            {...field}
            type={showPassword ? "text" : "password"}
            value={field.value ?? ""}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
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
