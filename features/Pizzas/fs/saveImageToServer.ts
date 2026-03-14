"use server";
import { randomUUID } from "crypto";
import path from "path";
import {
  PIZZA_FOLDER_NAME,
  PIZZA_FOLDER_PATH,
} from "../Constants/serverConstants";
import { createFolder, saveFile } from "../lib/serverUtils";

export async function saveImageToServer(pizzaImage: File) {
  await createFolder(PIZZA_FOLDER_PATH);

  const storedName = `${randomUUID()}${path.extname(pizzaImage.name)}`;
  const fsPath = path.join(PIZZA_FOLDER_PATH, storedName);
  const publicPath = `/uploads/${PIZZA_FOLDER_NAME}/${storedName}`;
  const fileBuffer = Buffer.from(await pizzaImage.arrayBuffer());

  await saveFile(fsPath, fileBuffer);

  return {
    storedName,
    publicPath,
    fsPath,
  };
}
