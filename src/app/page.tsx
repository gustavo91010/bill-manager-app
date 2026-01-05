'use client';

import { useEffect } from 'react';
// Note que NÃO importamos mais o useRouter aqui, pois vamos usar window.location
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LandingPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      console.log("Token capturado! Salvando e Forçando Recarregamento...");
      
      // 1. Salva no LocalStorage
      localStorage.setItem("jwtToken", token);

      // 2. Salva no Cookie
      Cookies.set('token', token, {
        expires: 7,
        path: '/',
        secure: window.location.protocol === 'https:', 
        sameSite: 'Lax'
      });

      // 3. A MUDANÇA MÁGICA:
      // Em vez de router.push, usamos window.location.href.
      // Isso força o navegador a recarregar a página do zero, enviando o cookie corretamente.
      window.location.href = '/dashboard'; 

    } else {
      // Se não tem token, manda pro login
      // Aqui tudo bem usar window.location também para garantir
      window.location.href = '/login';
    }
  }, [searchParams]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-white gap-4">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p>Finalizando autenticação...</p>
    </div>
  );
}