import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJwtSecrets, verifyAccessToken } from "@/shared/Functions/jwt";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  // Ha nincs access token a cookie-k között, akkor nincs bejelentkezett user
  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  const jwtSecrets = getJwtSecrets();
  // Ha nincs JWT secret a környezeti változók között
  if (!jwtSecrets) {
    return NextResponse.json({ user: null });
  }

  const decodedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );

  // Ha a token érvénytelen vagy lejárt, akkor nincs bejelentkezett user
  if (!decodedToken) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
    },
  });
}
