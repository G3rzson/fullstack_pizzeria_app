"use server";

import { createPizzaDal, PizzaCreateType } from "../Dal/pizza.dal";
import { saveImageToServer } from "../fs/saveImageToServer";
import { removeFile } from "../lib/serverUtils";
import { pizzaSchema, PizzaFormInputType } from "../Validation/pizzaSchema";
import {
  okResult,
  serverErrorResult,
  validationErrorResult,
  type ActionResult,
} from "@/lib/actionResult";

export async function createPizzaAction(
  data: unknown,
): Promise<ActionResult<PizzaFormInputType>> {
  const validatedData = await pizzaSchema.safeParseAsync(data);
  let savedFilePath: string | null = null;

  if (!validatedData.success) {
    return validationErrorResult(validatedData.error);
  }

  try {
    const { pizzaImage, ...pizzaData } = validatedData.data;
    let newPizza: PizzaCreateType = {
      ...pizzaData,
    };
    if (pizzaImage) {
      const { storedName, fsPath, publicPath } =
        await saveImageToServer(pizzaImage);

      savedFilePath = fsPath;

      newPizza = {
        ...newPizza,
        originalName: pizzaImage.name,
        storedName: storedName,
        mimeType: pizzaImage.type,
        size: pizzaImage.size,
        path: publicPath,
        createdBy: "admin",
      };
    }

    await createPizzaDal(newPizza);

    return okResult("Pizza sikeresen létrehozva!");
  } catch (error) {
    if (savedFilePath) {
      try {
        await removeFile(savedFilePath);
      } catch (cleanupError) {
        console.error("Error deleting orphaned file:", cleanupError);
      }
    }

    console.error("Error creating pizza:", error);
    return serverErrorResult(
      "Hiba történt a pizza létrehozásakor. Próbáld újra később!",
    );
  }
}
