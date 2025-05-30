// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'http://localhost:8183'
const token = 'ae3cbe27-cb95-40b2-b940-8d5624870101'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const path = (await params).path
  const url = `${API_BASE}/${path.join('/')}${req.nextUrl.search}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  })

  return NextResponse.json(await response.json())
}

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const path = pathname.replace('/api/proxy/', '')

  const body = await req.text()
  const response = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || '',
      'Authorization': token,
    },
    body,
  })

  const data = await response.text()
  return new NextResponse(data, { status: response.status })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const path = (await params).path
  // const path = params.path
  const url = `${API_BASE}/${path.join('/')}`

  const body = await req.text()
  
console.log("🔗 URL enviada para o backend:", url)
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': req.headers.get('content-type') || '',
      'Authorization': token,
    },
    body,
  })

  const data = await response.text()
  return new NextResponse(data, { status: response.status })
}

// import { NextRequest, NextResponse } from 'next/server'

// // const API_BASE = 'http://3.95.53.198:8183/bill-manager'
// const API_BASE = 'http://localhost:8183'


// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> }
// ): Promise<NextResponse> {
//   const path = (await params).path

//   const url = `${API_BASE}/${path.join("/")}${req.nextUrl.search}`;
//   // const url = `${API_BASE}/${path}/${req.nextUrl.search}`;
//   const token = "ae3cbe27-cb95-40b2-b940-8d5624870101";

//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Authorization': token,
//       'Content-Type': 'application/json',
//     },
//   });

//   // const data = await response.text();
//   // console.log("data", data)
//   // return new NextResponse(data, { status: response.status });
//   return NextResponse.json(await response.json());
// }


// export async function POST(req: NextRequest) {
//   const { pathname } = new URL(req.url)
//   const path = pathname.replace('/api/proxy/', '')

//   const body = await req.text()
//   const response = await fetch(`${API_BASE}/${path}`, {
//     method: 'POST',
//     headers: { 'Content-Type': req.headers.get('content-type') || '' },
//     body,
//   })
//   const data = await response.text()
//   return new NextResponse(data, { status: response.status })
// }

