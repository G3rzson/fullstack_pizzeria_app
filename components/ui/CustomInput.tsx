import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Field, FieldContent, FieldError, FieldLabel } from "./field";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Textarea } from "./textarea";
import PizzaImageDropzone from "./CustomDropzone";

type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "checkbox"
  | "file";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  type: InputType;
  label?: string;
  placeholder?: string;
};

export default function CustomInput<T extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
}: Props<T>) {
  function renderInput(
    type: InputType,
    field: ControllerRenderProps<T, Path<T>>,
    fieldState: ControllerFieldState,
  ) {
    switch (type) {
      case "textarea":
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
              id={field.name}
              {...field}
              rows={4}
              value={field.value ?? ""}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      case "checkbox":
        return (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              id={field.name}
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={fieldState.invalid}
            />
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        );
      case "number":
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              id={field.name}
              {...field}
              type={type}
              value={field.value ?? ""}
              onChange={(event) => {
                const rawValue = event.target.value;
                field.onChange(rawValue === "" ? undefined : Number(rawValue));
              }}
              min={1}
              max={9999}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );

      case "file":
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>
            <PizzaImageDropzone
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      default:
        /* Text / Password / Email */
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              id={field.name}
              {...field}
              type={type}
              value={field.value ?? ""}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => renderInput(type, field, fieldState)}
    />
  );
}
