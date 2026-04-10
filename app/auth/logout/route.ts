import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  const response = NextResponse.json({ message: "Sikeres kijelentkezés!" });

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
