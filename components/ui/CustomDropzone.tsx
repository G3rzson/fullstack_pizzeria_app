import { MAX_FILE_SIZE } from "@/features/Pizzas/Constants/Constants";
import { Button } from "./button";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useMemo } from "react";

type Props = {
  value: unknown;
  onChange: (value: File | null) => void;
  onBlur: () => void;
  invalid: boolean;
};

export default function PizzaImageDropzone({
  value,
  onChange,
  onBlur,
  invalid,
}: Props) {
  const selectedFile = useMemo(() => toSingleFile(value), [value]);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0] ?? null);
      onBlur();
    },
    [onBlur, onChange],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        aria-invalid={invalid}
        className={[
          "cursor-pointer rounded-lg border border-dashed p-4 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-input",
          isDragReject ? "border-destructive bg-destructive/5" : "",
          invalid ? "border-destructive" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium">
          {isDragActive
            ? "Dobd ide a képet"
            : "Húzd ide a képet, vagy kattints a feltöltéshez"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WEBP, GIF - max {MAX_FILE_SIZE / (1024 * 1024)} MB
        </p>
      </div>

      {fileRejections.length > 0 && (
        <p className="text-sm text-destructive">
          A fájl nem megfelelő típusú vagy túl nagy.
        </p>
      )}

      {selectedFile && previewUrl && (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-lg border border-input">
            <img
              src={previewUrl}
              alt="Pizza előnézet"
              className="h-48 w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{selectedFile.name}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(null)}
            >
              Törlés
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function toSingleFile(value: unknown): File | null {
  if (typeof File !== "undefined" && value instanceof File) {
    if (value.size === 0 && value.name === "") return null;
    return value;
  }

  if (typeof FileList !== "undefined" && value instanceof FileList) {
    if (value.length === 0) return null;
    return value.item(0);
  }

  return null;
}
