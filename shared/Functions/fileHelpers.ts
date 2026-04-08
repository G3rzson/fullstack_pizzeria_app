type FileListLike = {
  length: number;
  item: (index: number) => File | null;
};

export function isFileListLike(value: unknown): value is FileListLike {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FileListLike>;
  return (
    typeof candidate.length === "number" && typeof candidate.item === "function"
  );
}

export function toSingleFile(value: unknown): File | null {
  if (typeof File !== "undefined" && value instanceof File) {
    if (value.size === 0 && value.name === "") return null;
    return value;
  }

  if (isFileListLike(value)) {
    if (value.length === 0) return null;
    return value.item(0);
  }

  return null;
}

export type ExistingImageValue = {
  name: string;
  url: string;
};

export function toExistingImage(value: unknown): ExistingImageValue | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<ExistingImageValue>;
  if (typeof candidate.name !== "string" || typeof candidate.url !== "string") {
    return null;
  }

  if (!candidate.url.trim()) return null;

  return {
    name: candidate.name.trim() || "pizza-image",
    url: candidate.url,
  };
}
