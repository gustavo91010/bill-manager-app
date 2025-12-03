import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ ok: true });

  // reenviar os headers originais
  // o front lê esses daqui
  response.headers.set("x-user-name", "");
  response.headers.set("x-user-email", "");

  return response;
}

