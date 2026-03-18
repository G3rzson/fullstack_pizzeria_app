import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const loginUrl = new URL("/user/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
