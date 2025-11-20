import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  // {path: '/pricing', whenAuthenticated: 'next'}, 
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

  // Caso: Não tem token e está numa rota pública
  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  // Caso: Não tem token e rota é protegida
  if (!authToken && !publicRoute) {
    // 🔴 NOVA PROTEÇÃO 1: Se for POST/PUT/DELETE, retorna JSON 401 em vez de redirect
    // Isso evita o erro 405 Method Not Allowed em produção
    if (request.method !== 'GET') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Se for navegação normal (GET), redireciona pro Login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  // Caso: Tem token → validar se quer acessar login
  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Caso: Tem token → validar expiração
  if (authToken) {
    const decoded = decodeJwt(authToken);
    
    // Se expirou
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      
      // 🔴 NOVA PROTEÇÃO 2: Se expirou durante um POST, avisa via JSON
      if (request.method !== 'GET') {
        const response = NextResponse.json({ message: 'Session expired' }, { status: 401 });
        response.cookies.delete("token");
        return response;
      }

      // Se expirou durante navegação (GET), redireciona
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url)
      );
      response.cookies.delete("token"); // remove cookie inválido
      return response;
    }
  }

  // Caso: Está logado e acessando rota pública com `redirect` (Redundância da checagem acima, mas ok manter)
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