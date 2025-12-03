// src/app/api/auth/callback/route.ts
// https://seu-front.com/api/auth/callback?token=JWT_DO_BACK&name=...&email=...

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const token = url.searchParams.get("token");
  const name = url.searchParams.get("name");
  const email = url.searchParams.get("email");

  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL("/login/auto", req.url));

  response.cookies.set("jwtToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  response.headers.set("x-user-name", name || "");
  response.headers.set("x-user-email", email || "");

  return response;
}
