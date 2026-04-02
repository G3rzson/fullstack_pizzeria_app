import fs from "fs/promises";
import path from "path";
import { getCurrentError } from "./getCurrentError";

export async function errorLogger(error: unknown, context: string) {
  try {
    const logDirectory = path.join(process.cwd(), "logs");
    const isDev = process.env.NODE_ENV !== "production";

    await fs.mkdir(logDirectory, { recursive: true });

    let errorLog = getCurrentError(error);

    const logFilePath = path.join(logDirectory, "error.log");

    const logObject = {
      date: new Date().toISOString(),
      context,
      error: errorLog,
    };

    const logMessage = isDev
      ? JSON.stringify(logObject, null, 2) + "\n"
      : JSON.stringify(logObject) + "\n";

    await fs.appendFile(logFilePath, logMessage);
  } catch (fsError) {
    console.error("Failed to write to log file:", fsError);
  }
}
