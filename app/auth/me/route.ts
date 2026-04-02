import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJwtSecrets, verifyAccessToken } from "@/shared/Functions/jwt";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  // Ha nincs access token a cookie-k között, 401-et adunk vissza hogy a fetchWrapper refresh-t próbáljon
  if (!accessToken) {
    return NextResponse.json(
      { user: null, error: "No access token" },
      { status: 401 },
    );
  }

  const jwtSecrets = getJwtSecrets();
  // Ha nincs JWT secret a környezeti változók között
  if (!jwtSecrets) {
    return NextResponse.json(
      { user: null, error: "JWT secrets missing" },
      { status: 500 },
    );
  }

  const decodedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );

  // Ha a token érvénytelen vagy lejárt, 401-et adunk vissza hogy a fetchWrapper refresh-t próbáljon
  if (!decodedToken) {
    return NextResponse.json(
      { user: null, error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
    },
  });
}
