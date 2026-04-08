"use server";

import { cookies } from "next/headers";
import { getJwtSecrets, verifyAccessToken } from "./jwt";

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    return null;
  }

  const verifiedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );
  if (!verifiedToken) {
    return null;
  }

  const userData = {
    id: verifiedToken.id,
    username: verifiedToken.username,
    role: verifiedToken.role,
  };

  return userData;
}
