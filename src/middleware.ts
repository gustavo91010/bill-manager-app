import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  // {path: '/pricing', whenAuthenticated: 'next'}, // caso o usuario possa acessar mesmo autenticado
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

function decodeJwt(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString("utf-8"));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find(route => route.path === path)
  const authToken = request.cookies.get("token")?.value;
  console.log('MIDDLEWARE - authToken:', authToken);

  // Caso: Não tem token e está numa rota pública
  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  // Caso: Não tem token e rota é protegida → redireciona
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  // Caso: Tem token → validar
  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Caso: Tem token → validar
  if (authToken) {
    // checar se o jwt n tá expirado
    //fazer decode da data de expiração do jwt
    // se sim, remover cookie e redirecionar o usuario pro login
    //aplicar uma estrátegia de refresh
    const decoded = decodeJwt(authToken);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      // Token expirado ou inválido
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url)
      );
      response.cookies.delete("token"); // remove cookie inválido
      return response;
    }
    // return NextResponse.next()
  }

  // Caso: Está logado e acessando rota pública com `redirect`
  if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Caso: Token válido → segue
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}