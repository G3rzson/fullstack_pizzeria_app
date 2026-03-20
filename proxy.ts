import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { getUser, getPermissions } = await getKindeServerSession();
  const user = await getUser();

  // Ha nincs bejelentkezve, redirecteljük a főoldalra
  // A login-t a Kinde komponensek (LoginLink) kezelik
  if (!user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Permissions lekérése
  const permissions = await getPermissions();
  const permissionsList = permissions?.permissions || [];

  // Ellenőrizzük, hogy van-e admin jogosultság
  const isAdminByPermission = permissionsList.includes("admin-user");

  // Ha nincs admin permission, redirect a főoldalra
  if (!isAdminByPermission) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Ha minden rendben, engedjük tovább
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // minden /admin aloldalra érvényes
};
