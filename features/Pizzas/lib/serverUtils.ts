"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";

export async function createFolder(folderPath: string) {
  await mkdir(folderPath, { recursive: true });
}

export async function saveFile(filePath: string, fileBuffer: Buffer) {
  await writeFile(filePath, fileBuffer);
}

export async function removeFile(filePath: string) {
  await unlink(filePath);
}
