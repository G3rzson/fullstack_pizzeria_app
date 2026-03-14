import path from "path";
import "server-only";

export const ROOT_PATH = process.cwd();
export const PIZZA_FOLDER_NAME = "pizzas";
export const PIZZA_FOLDER_PATH = path.join(
  ROOT_PATH,
  "public",
  "uploads",
  PIZZA_FOLDER_NAME,
);
