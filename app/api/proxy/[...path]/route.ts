import { NextRequest, NextResponse } from 'next/server'

const APP_BASE = 'http://107.23.71.21:8082'
const API_BASE = 'http://3.229.225.73:8183'

async function fetchWithHandling(url: string, options: RequestInit) {
  // console.log('Enviando requisição para:', url)
  // console.log('Headers:', options.headers)
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      const text = await response.text()
      return new NextResponse(text, { status: response.status })
    }
    const data = await response.json()
    // console.log("data", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao acessar API externa:', error)
    return NextResponse.json(
      { error: 'Erro ao conectar com a API externa. Tente novamente mais tarde.' },
      { status: 503 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const path = (await params).path
  const base = path.includes('users') ? APP_BASE : API_BASE;
  const url = `${base}/${path.join('/')}${req.nextUrl.search}`;
  // const url = `${API_BASE}/${path.join('/')}${req.nextUrl.search}`

  const token = req.headers.get('Authorization') || ''

  return fetchWithHandling(url, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const path = pathname.replace('/api/proxy/', '')
  const body = await req.text()
  const url = `${API_BASE}/${path}`

  const token = req.headers.get('Authorization') || ''

  return fetchWithHandling(url, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || '',
      'Authorization': token,
    },
    body,
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = (await params).path
  const url = `${API_BASE}/${path.join('/')}`
  const body = await req.text()

  const token = req.headers.get('Authorization') || ''

  return fetchWithHandling(url, {
    method: 'PUT',
    headers: {
      'Content-Type': req.headers.get('content-type') || '',
      'Authorization': token,
    },
    body,
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path
  const url = `${API_BASE}/${path.join('/')}`

  const token = req.headers.get('Authorization') || ''

  return fetchWithHandling(url, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-Type': req.headers.get('content-type') || '',
    },
  })
}
