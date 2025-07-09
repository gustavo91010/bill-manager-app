import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'http://3.229.225.73:8183'
const token = process.env.NEXT_PUBLIC_API_TOKEN!

async function fetchWithHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      const text = await response.text()
      return new NextResponse(text, { status: response.status })
    }
    const data = await response.json()
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
  const url = `${API_BASE}/${path.join('/')}${req.nextUrl.search}`

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

  return fetchWithHandling(url, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-Type': req.headers.get('content-type') || '',
    },
  })
}
